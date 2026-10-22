import { monthLabel } from "../../utils/eventDates.js";
import EventRow from "./EventRow.jsx";

/**
 * Events grouped under month headings ("October 2026").
 * `fromDay`: an event that started earlier but is still running shows this day in its date tag.
 */
export default function ListView({ events, fromDay, past }) {
  if (!events.length) {
    return (
      <p className="events-empty">
        {past ? "There are no past events." : "There are no upcoming events."}
      </p>
    );
  }

  const rows = events.map((e) => {
    const start = e.start.slice(0, 10);
    const day = !past && fromDay && start < fromDay ? fromDay : start;
    return { event: e, day };
  });

  const groups = [];
  for (const row of rows) {
    const key = row.day.slice(0, 7);
    if (!groups.length || groups[groups.length - 1].key !== key) groups.push({ key, rows: [] });
    groups[groups.length - 1].rows.push(row);
  }

  return (
    <div className="list-view">
      {groups.map((g) => (
        <section key={g.key}>
          <h3 className="events-separator">{monthLabel(`${g.key}-01`)}</h3>
          <ul className="events-list">
            {g.rows.map(({ event, day }) => (
              <EventRow key={event.id} event={event} day={day} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
