import { timeLabel } from "../../utils/eventDates.js";
import EventRow from "./EventRow.jsx";

// Events of one day, grouped by start time ("All day / ongoing" first)
export default function DayView({ date, events }) {
  if (!events.length) {
    return <p className="events-empty">There are no events scheduled for this day.</p>;
  }

  const groups = new Map();
  for (const e of events) {
    const key = e.start.slice(0, 10) < date ? "Ongoing" : e.allDay ? "All day" : timeLabel(e.start);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(e);
  }

  return (
    <div className="day-view">
      {[...groups].map(([time, list]) => (
        <section key={time} className="day-view__group">
          <h3 className="events-separator">{time}</h3>
          <ul className="events-list">
            {list.map((e) => (
              <EventRow key={e.id} event={e} day={date} showDateTag={false} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
