import { useState } from "react";
import { Link } from "react-router-dom";
import { monthGrid, occursOn, todayYmd, timeLabel, eventRange, longDate } from "../../utils/eventDates.js";
import EventRow from "./EventRow.jsx";
import "./MonthView.css";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MAX_PER_DAY = 3;

/**
 * Calendar grid. Desktop: event titles in each day + hover preview card.
 * Mobile: a dot per day with events; tapping a day lists its events below.
 */
export default function MonthView({ date, events, onShowDay }) {
  const weeks = monthGrid(date);
  const month = date.slice(0, 7);
  const today = todayYmd();
  const [selected, setSelected] = useState(today.slice(0, 7) === month ? today : `${month}-01`);

  const eventsOn = (day) => events.filter((e) => occursOn(e, day));
  const selectedEvents = eventsOn(selected);

  return (
    <div className="month">
      <div className="month__grid" role="grid" aria-label="Month calendar">
        <div className="month__head" role="row">
          {WEEKDAYS.map((d) => (
            <div key={d} className="month__head-cell" role="columnheader">
              {d}
            </div>
          ))}
        </div>

        {weeks.map((week) => (
          <div key={week[0]} className="month__week" role="row">
            {week.map((day) => {
              const dayEvents = eventsOn(day);
              const outside = day.slice(0, 7) !== month;
              const classes = [
                "month__day",
                outside && "is-outside",
                day < today && "is-past",
                day === today && "is-today",
                day === selected && "is-selected",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <div key={day} className={classes} role="gridcell">
                  <button
                    className="month__daynum"
                    onClick={() => setSelected(day)}
                    aria-label={`${longDate(day)}, ${dayEvents.length} events`}
                  >
                    {Number(day.slice(8))}
                    {dayEvents.length > 0 && <span className="month__dot" aria-hidden="true" />}
                  </button>

                  <ul className="month__events">
                    {dayEvents.slice(0, MAX_PER_DAY).map((e) => {
                      const continues = e.start.slice(0, 10) < day;
                      return (
                        <li key={e.id} className={`month__event ${continues ? "is-continued" : ""}`}>
                          <Link to={`/event/${e.slug}`} className="month__event-link">
                            {!continues && !e.allDay && <span className="month__event-time">{timeLabel(e.start)}</span>}
                            <span className="month__event-title">{e.title}</span>
                          </Link>

                          {/* Hover preview */}
                          <div className="month__tooltip" role="tooltip">
                            {e.image && <img src={e.image} alt="" loading="lazy" />}
                            <div className="month__tooltip-body">
                              <div className="month__tooltip-date">{eventRange(e)}</div>
                              <h5>{e.title}</h5>
                              <p>{e.description}</p>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {dayEvents.length > MAX_PER_DAY && (
                    <button className="month__more" onClick={() => onShowDay(day)}>
                      + {dayEvents.length - MAX_PER_DAY} more
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Mobile: events of the tapped day */}
      <div className="month__mobile-list">
        <h4>{longDate(selected)}</h4>
        {selectedEvents.length ? (
          <ul>
            {selectedEvents.map((e) => (
              <EventRow key={e.id} event={e} day={selected} showDateTag={false} />
            ))}
          </ul>
        ) : (
          <p className="events-empty">There are no events on this day.</p>
        )}
      </div>
    </div>
  );
}
