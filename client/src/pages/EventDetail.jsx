import { Link, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch.js";
import { api } from "../services/api.js";
import Loader from "../components/ui/Loader.jsx";
import PageTitle from "../components/ui/PageTitle.jsx";
import Icon from "../components/ui/Icons.jsx";
import { eventRange, longDate, timeLabel, googleCalendarUrl, todayYmd } from "../utils/eventDates.js";
import "./EventDetail.css";

export default function EventDetail() {
  const { slug } = useParams();
  const { data: event, loading, error } = useFetch(() => api.getEvent(slug), [slug]);

  if (loading) return <Loader />;
  if (error || !event) {
    return (
      <>
        <PageTitle title="Event not found" crumbs={[{ label: "Events", path: "/events" }, { label: "Not found" }]} />
        <section className="section">
          <div className="container">
            <p className="events-empty">
              This event does not exist or has been removed. <Link to="/events">See all events</Link>
            </p>
          </div>
        </section>
      </>
    );
  }

  const startDay = event.start.slice(0, 10);
  const endDay = event.end.slice(0, 10);
  const isPast = endDay < todayYmd();

  return (
    <>
      <PageTitle
        title={event.title}
        image={event.image}
        imagePosition="center 30%"
        crumbs={[{ label: "Events", path: "/events" }, { label: event.title }]}
      />

      <section className="section event-detail">
        <div className="container">
          <Link to="/events" className="event-detail__back">
            <Icon name="chevronLeft" size={16} /> All Events
          </Link>

          {isPast && <p className="events-empty event-detail__notice">This event has passed.</p>}

          <div className="event-detail__grid">
            <div className="event-detail__main">
              <div className="event-detail__datetime">
                {eventRange(event)}
                {event.cost && <span className="event-detail__cost">{event.cost}</span>}
              </div>
              <h2 className="event-detail__title">{event.title}</h2>

              {event.image && (
                <div className="event-detail__image">
                  <img src={event.image} alt="" />
                </div>
              )}

              <p className="event-detail__desc">{event.description}</p>

              <div className="event-detail__actions">
                <a href={googleCalendarUrl(event)} target="_blank" rel="noreferrer" className="btn btn--primary btn--small">
                  + Google Calendar
                </a>
                <a href={api.eventsIcsUrl(event.slug)} download className="btn btn--outline btn--small">
                  + iCal Export
                </a>
              </div>
            </div>

            <aside className="event-detail__meta">
              <div className="event-detail__box">
                <h5>Details</h5>
                <dl>
                  <dt>Date</dt>
                  <dd>{startDay === endDay ? longDate(startDay) : `${longDate(startDay)} – ${longDate(endDay)}`}</dd>
                  <dt>Time</dt>
                  <dd>{event.allDay ? "To be announced" : `${timeLabel(event.start)} – ${timeLabel(event.end)}`}</dd>
                  {event.recurring && (
                    <>
                      <dt>Repeats</dt>
                      <dd>Every week</dd>
                    </>
                  )}
                  {event.cost && (
                    <>
                      <dt>Cost</dt>
                      <dd>{event.cost}</dd>
                    </>
                  )}
                  {event.category && (
                    <>
                      <dt>Category</dt>
                      <dd>{event.category}</dd>
                    </>
                  )}
                </dl>
              </div>

              <div className="event-detail__box">
                <h5>Venue</h5>
                <p>
                  <strong>{event.venue.name}</strong>
                  <br />
                  {event.venue.address}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${event.venue.name}, ${event.venue.address}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="link-more"
                >
                  Google Map
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
