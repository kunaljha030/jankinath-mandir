import { Link } from "react-router-dom";
import { eventRange, weekdayShort, todayYmd } from "../../utils/eventDates.js";
import Reveal from "../ui/Reveal.jsx";
import "./EventRow.css";

/**
 * One event in the List / Day views.
 * `day` = the date shown in the date tag (an ongoing event shows the current day).
 */
export default function EventRow({ event, day, showDateTag = true }) {
  const isToday = day === todayYmd();

  return (
    <Reveal as="li" className="event-row">
      {showDateTag && (
        <div className={`event-row__date ${isToday ? "is-today" : ""}`}>
          <time dateTime={day}>
            <span className="event-row__weekday">{weekdayShort(day)}</span>
            <span className="event-row__daynum">{Number(day.slice(8, 10))}</span>
          </time>
        </div>
      )}

      <article className="event-row__card">
        <div className="event-row__details">
          <div className="event-row__datetime">
            {eventRange(event)}
            {event.recurring && <span className="event-row__badge">Weekly</span>}
          </div>
          <h3 className="event-row__title">
            <Link to={`/event/${event.slug}`}>{event.title}</Link>
          </h3>
          <address className="event-row__venue">
            <strong>Location</strong> {event.venue.name}, {event.venue.address}
          </address>
          <p className="event-row__desc">{event.description}</p>
          {event.cost && <span className="event-row__cost">{event.cost}</span>}
        </div>

        {event.image && (
          <Link to={`/event/${event.slug}`} className="event-row__image" tabIndex={-1} aria-hidden="true">
            <img src={event.image} alt="" loading="lazy" />
          </Link>
        )}
      </article>
    </Reveal>
  );
}
