import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../services/api.js";
import PageTitle from "../components/ui/PageTitle.jsx";
import EventsBar from "../components/events/EventsBar.jsx";
import EventsTopBar from "../components/events/EventsTopBar.jsx";
import ListView from "../components/events/ListView.jsx";
import MonthView from "../components/events/MonthView.jsx";
import DayView from "../components/events/DayView.jsx";
import EventsNav from "../components/events/EventsNav.jsx";
import SubscribeDropdown from "../components/events/SubscribeDropdown.jsx";
import {
  todayYmd,
  addDays,
  addMonths,
  isValidYmd,
  monthGrid,
  monthLabel,
  monthName,
  longDate,
} from "../utils/eventDates.js";
import "./Events.css";

const LIST_PAGE_SIZE = 10;

/**
 * Events calendar. Everything lives in the URL so views can be linked/bookmarked:
 *   /events?view=list|month|day&date=YYYY-MM-DD&search=katha&past=1
 */
export default function Events() {
  const [params, setParams] = useSearchParams();
  const today = todayYmd();
  const view = ["list", "month", "day"].includes(params.get("view")) ? params.get("view") : "list";
  const date = isValidYmd(params.get("date")) ? params.get("date") : today;
  const search = params.get("search") || "";
  const past = view === "list" && params.get("past") === "1";

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const update = useCallback(
    (changes) => {
      const next = new URLSearchParams(params);
      Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
      if (next.get("date") === today) next.delete("date");
      if (next.get("view") === "list") next.delete("view");
      setParams(next);
    },
    [params, setParams, today]
  );

  // Which date range to ask the API for
  const query = useMemo(() => {
    if (view === "month") {
      const weeks = monthGrid(date);
      return { from: weeks[0][0], to: weeks.at(-1)[6] };
    }
    if (view === "day") return { from: date, to: date };
    if (past) return { to: addDays(date, -1), order: "desc" };
    return { from: date };
  }, [view, date, past]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .getEvents({ ...query, search })
      .then((data) => active && (setEvents(data), setError(null)))
      .catch((err) => active && setError(err))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [query, search]);

  // ---------- List view paging ----------
  const listEvents = view === "list" ? events.slice(0, LIST_PAGE_SIZE) : events;
  const hasMore = view === "list" && events.length > LIST_PAGE_SIZE;

  const nav = {
    list: {
      label: past ? "Past Events" : date === today ? "Upcoming" : `From ${longDate(date)}`,
      prevLabel: "Previous Events",
      nextLabel: "Next Events",
      prev: () =>
        past
          ? update({ date: listEvents.length ? listEvents.at(-1).start.slice(0, 10) : date, past: "1" })
          : update({ date: today, past: "1" }),
      next: () => {
        if (past) return update({ date: today, past: null });
        // Continue from the first event that didn't fit on this page
        const nextStart = events[LIST_PAGE_SIZE].start.slice(0, 10);
        update({ date: nextStart > date ? nextStart : addDays(date, 1) });
      },
      prevDisabled: past && !hasMore,
      nextDisabled: !past && !hasMore,
    },
    month: {
      label: monthLabel(date),
      prevLabel: monthName(addMonths(date, -1)),
      nextLabel: monthName(addMonths(date, 1)),
      prev: () => update({ date: addMonths(date, -1) }),
      next: () => update({ date: addMonths(date, 1) }),
    },
    day: {
      label: longDate(date),
      prevLabel: "Previous Day",
      nextLabel: "Next Day",
      prev: () => update({ date: addDays(date, -1) }),
      next: () => update({ date: addDays(date, 1) }),
    },
  }[view];

  const goToday = () => update({ date: today, past: null });
  const count = view === "list" ? listEvents.length : events.length;

  return (
    <>
      <PageTitle
        title="Upcoming Events"
        image="/images/sant-samagam-3.jpg"
        imagePosition="center 35%"
        crumbs={[{ label: "Events" }]}
      />

      <section className="section events-page">
        <div className="container">
          <p className="visually-hidden" aria-live="polite">
            {loading ? "Loading events" : `${count} events found.`}
          </p>

          <EventsBar
            search={search}
            view={view}
            onSearch={(q) => update({ search: q })}
            onView={(v) => update({ view: v, past: null })}
          />

          <EventsTopBar
            label={nav.label}
            pickerType={view === "month" ? "month" : "date"}
            pickerValue={view === "month" ? date.slice(0, 7) : date}
            onPrev={nav.prev}
            onNext={nav.next}
            onToday={goToday}
            isToday={date === today && !past}
            onPick={(v) => update({ date: view === "month" ? `${v}-01` : v, past: null })}
          />

          {search && (
            <p className="events-search-note">
              Showing results for <strong>“{search}”</strong>{" "}
              <button onClick={() => update({ search: null })}>Clear search</button>
            </p>
          )}

          <div className={`events-body ${loading ? "is-loading" : ""}`}>
            {error ? (
              <p className="events-empty">Could not load events. Is the API server running?</p>
            ) : view === "month" ? (
              <MonthView date={date} events={events} onShowDay={(d) => update({ view: "day", date: d })} />
            ) : view === "day" ? (
              <DayView date={date} events={events} />
            ) : (
              <ListView events={listEvents} fromDay={date} past={past} />
            )}
          </div>

          <EventsNav
            prevLabel={nav.prevLabel}
            nextLabel={nav.nextLabel}
            onPrev={nav.prev}
            onNext={nav.next}
            onToday={goToday}
            prevDisabled={nav.prevDisabled}
            nextDisabled={nav.nextDisabled}
          />

          <div className="events-footer">
            <SubscribeDropdown />
          </div>
        </div>
      </section>
    </>
  );
}
