// Date helpers for the events calendar. Dates are handled as local "YYYY-MM-DD" strings.

const pad = (n) => String(n).padStart(2, "0");

export const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parseYmd = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
export const todayYmd = () => ymd(new Date());

export const addDays = (s, n) => {
  const d = parseYmd(s);
  d.setDate(d.getDate() + n);
  return ymd(d);
};
export const addMonths = (s, n) => {
  const d = parseYmd(s);
  return ymd(new Date(d.getFullYear(), d.getMonth() + n, 1));
};
export const isValidYmd = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s || "") && !isNaN(parseYmd(s));

export const monthLabel = (s) => parseYmd(s).toLocaleString("en-US", { month: "long", year: "numeric" });
export const monthName = (s) => parseYmd(s).toLocaleString("en-US", { month: "long" });
export const longDate = (s) =>
  parseYmd(s).toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" });
export const weekdayShort = (s) => parseYmd(s).toLocaleString("en-US", { weekday: "short" });
export const weekdayLong = (s) => parseYmd(s).toLocaleString("en-US", { weekday: "long" });

// "2026-10-25T19:00" -> "7:00 pm"
export function timeLabel(dt) {
  const [h, m] = dt.slice(11, 16).split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  return `${h % 12 || 12}:${pad(m)} ${suffix}`;
}

// "October 25, 2026 @ 7:00 pm - 11:30 pm"  or  "October 11, 2026 @ 8:00 am - October 19, 2026 @ 12:00 pm"
// All-day events (no time announced): "October 29, 2026 - November 5, 2026"
export function eventRange(e) {
  const sDay = e.start.slice(0, 10);
  const eDay = e.end.slice(0, 10);
  if (e.allDay) return sDay === eDay ? longDate(sDay) : `${longDate(sDay)} - ${longDate(eDay)}`;
  const start = `${longDate(sDay)} @ ${timeLabel(e.start)}`;
  return sDay === eDay ? `${start} - ${timeLabel(e.end)}` : `${start} - ${longDate(eDay)} @ ${timeLabel(e.end)}`;
}

// Weeks (Mon–Sun) covering the month that contains `s`
export function monthGrid(s) {
  const first = parseYmd(s);
  first.setDate(1);
  const start = new Date(first);
  start.setDate(1 - ((first.getDay() + 6) % 7)); // back to Monday
  const last = new Date(first.getFullYear(), first.getMonth() + 1, 0);
  const end = new Date(last);
  end.setDate(last.getDate() + ((7 - last.getDay()) % 7)); // forward to Sunday

  const weeks = [];
  for (let d = new Date(start); d <= end; ) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(ymd(d));
      d.setDate(d.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

// Is the event running on day `s`?
export const occursOn = (e, s) => e.start.slice(0, 10) <= s && e.end.slice(0, 10) >= s;

// Google Calendar "add event" link
export function googleCalendarUrl(e) {
  const fmt = (dt) => dt.replace(/[-:]/g, "") + "00";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${fmt(e.start)}/${fmt(e.end)}`,
    ctz: "Asia/Kolkata",
    details: e.description,
    location: `${e.venue.name}, ${e.venue.address}`,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}
