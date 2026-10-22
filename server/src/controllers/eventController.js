import { readData } from "../utils/jsonStore.js";

// Event times are stored as local mandir time ("2026-10-25T19:00"), no timezone.
const toDate = (s) => new Date(s);
const pad = (n) => String(n).padStart(2, "0");
const localISO = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

// Expand repeating events ("repeat": { "every": "week", "until": "..." }) into single occurrences
function expand(events, venue) {
  const out = [];
  for (const ev of events) {
    const base = { ...ev, venue: ev.venue || venue };
    delete base.repeat;
    if (!ev.repeat) {
      out.push(base);
      continue;
    }
    const step = ev.repeat.every === "week" ? 7 : 1;
    const until = toDate(`${ev.repeat.until}T23:59`);
    const start = toDate(ev.start);
    const length = toDate(ev.end) - start;
    for (let s = new Date(start); s <= until; s.setDate(s.getDate() + step)) {
      const day = localISO(s).slice(0, 10);
      out.push({
        ...base,
        id: `${ev.id}-${day}`,
        slug: `${ev.slug}-${day}`,
        start: localISO(s),
        end: localISO(new Date(s.getTime() + length)),
        recurring: true,
      });
    }
  }
  return out.sort((a, b) => a.start.localeCompare(b.start));
}

async function loadEvents() {
  const { venue, events } = await readData("events");
  return expand(events, venue);
}

/**
 * GET /api/events
 *   ?search=katha        text search in title / description / category
 *   ?from=2026-10-14     events still running on or after this day
 *   ?to=2026-10-31       events starting on or before this day
 *   ?order=desc          newest first (used for "Previous Events")
 *   ?aagami=1            only Maharaj Ji's published programmes ("आगामी कथाएँ")
 */
export async function getEvents(req, res, next) {
  try {
    const { search, from, to, order, aagami } = req.query;
    let events = await loadEvents();

    if (aagami) events = events.filter((e) => e.aagami);
    if (search) {
      const q = search.toLowerCase();
      events = events.filter((e) =>
        [e.title, e.description, e.category].some((f) => f?.toLowerCase().includes(q))
      );
    }
    if (from) events = events.filter((e) => e.end.slice(0, 10) >= from);
    if (to) events = events.filter((e) => e.start.slice(0, 10) <= to);
    if (order === "desc") events.reverse();

    res.json(events);
  } catch (err) {
    next(err);
  }
}

export async function getEventBySlug(req, res, next) {
  try {
    const events = await loadEvents();
    const event = events.find((e) => e.slug === req.params.slug);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    next(err);
  }
}

// ---------- Calendar export (.ics) ----------
const icsDate = (s) => s.replace(/[-:]/g, "") + "00";
const icsText = (s = "") => s.replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");

function toIcs(events) {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Shri Janki Nath Bada Mandir//Events//EN",
    "CALSCALE:GREGORIAN",
    "X-WR-CALNAME:Shri Janki Nath Bada Mandir",
    "X-WR-TIMEZONE:Asia/Kolkata",
  ];
  for (const e of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.slug}@janki-nath-mandir`,
      `DTSTAMP:${stamp}`,
      `DTSTART;TZID=Asia/Kolkata:${icsDate(e.start)}`,
      `DTEND;TZID=Asia/Kolkata:${icsDate(e.end)}`,
      `SUMMARY:${icsText(e.title)}`,
      `DESCRIPTION:${icsText(e.description)}`,
      `LOCATION:${icsText(`${e.venue.name}, ${e.venue.address}`)}`,
      "END:VEVENT"
    );
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function sendIcs(res, filename, events) {
  res.setHeader("Content-Type", "text/calendar; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(toIcs(events));
}

// GET /api/events/ics — every upcoming event
export async function getEventsIcs(req, res, next) {
  try {
    const today = localISO(new Date()).slice(0, 10);
    const events = (await loadEvents()).filter((e) => e.end.slice(0, 10) >= today);
    sendIcs(res, "mandir-events.ics", events);
  } catch (err) {
    next(err);
  }
}

// GET /api/events/:slug/ics — one event
export async function getEventIcs(req, res, next) {
  try {
    const event = (await loadEvents()).find((e) => e.slug === req.params.slug);
    if (!event) return res.status(404).json({ message: "Event not found" });
    sendIcs(res, `${event.slug}.ics`, [event]);
  } catch (err) {
    next(err);
  }
}
