import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch.js";
import { api } from "../../services/api.js";
import { useSite } from "../../context/SiteContext.jsx";
import { timeLabel, todayYmd } from "../../utils/eventDates.js";
import Icon from "./Icons.jsx";
import InstagramEmbed from "./InstagramEmbed.jsx";
import "./ConnectCards.css";

const YOUTUBE_VIDEOS = 2;

// Columns from site.json → "connect": YouTube (latest videos), Instagram (a post), WhatsApp,
// आगामी कथाएँ (upcoming programmes, date-wise). Each column has a profile header that links to the channel.
export default function ConnectCards() {
  const site = useSite();
  const channels = site?.connect || [];

  return (
    <div className="connect-cards">
      {channels.map((c) => (
        <div key={c.name} className={`connect-card connect-card--${c.name}`}>
          <ProfileHeader channel={c} />
          <div className="connect-card__body">
            {c.name === "youtube" && <YoutubeVideos channel={c} />}
            {c.name === "instagram" && c.post && <InstagramEmbed url={c.post} />}
            {c.name === "whatsapp" && <WhatsappBody channel={c} />}
            {c.name === "katha" && <KathaList />}
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfileHeader({ channel: c }) {
  const inner = (
    <>
      <span className="connect-card__avatar">
        <img src={c.avatar} alt="" />
        <span className="connect-card__badge" aria-hidden="true">
          <Icon name={c.icon || c.name} size={12} />
        </span>
      </span>
      <span className="connect-card__who">
        <span className="connect-card__title">{c.title}</span>
        <span className="connect-card__handle">{c.handle}</span>
      </span>
      <span className="connect-card__cta">{c.url ? c.cta : "Coming soon"}</span>
    </>
  );

  // Internal pages ("/events") open in the same tab
  if (c.url?.startsWith("/")) {
    return (
      <Link className="connect-card__header" to={c.url}>
        {inner}
      </Link>
    );
  }

  return c.url ? (
    <a className="connect-card__header" href={c.url} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <div className="connect-card__header connect-card__header--disabled">{inner}</div>
  );
}

// Latest uploads, refreshed by the API from the channel; placeholders while loading,
// and a link to the channel if YouTube can't be reached.
function YoutubeVideos({ channel: c }) {
  const { data, loading } = useFetch(() => api.getYoutube());
  const videos = data?.videos.slice(0, YOUTUBE_VIDEOS) || [];

  if (loading) {
    return (
      <div className="connect-card__videos">
        {Array.from({ length: YOUTUBE_VIDEOS }, (_, i) => (
          <div key={i} className="connect-card__video connect-card__video--loading" />
        ))}
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div className="connect-card__fallback">
        <span className="connect-card__fallback-icon" aria-hidden="true">
          <Icon name="youtube" size={36} />
        </span>
        <p>{c.text}</p>
        <a className="btn btn--primary btn--small" href={c.url} target="_blank" rel="noopener noreferrer">
          Watch on YouTube
        </a>
      </div>
    );
  }

  return (
    <div className="connect-card__videos">
      {videos.map((v) => (
        <div key={v.videoId} className="connect-card__video">
          <iframe
            src={`https://www.youtube.com/embed/${v.videoId}`}
            title={v.title}
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ))}
    </div>
  );
}

function WhatsappBody({ channel: c }) {
  return (
    <div className="connect-card__fallback">
      <span className="connect-card__fallback-icon" aria-hidden="true">
        <Icon name="whatsapp" size={40} />
      </span>
      <p>{c.text}</p>
      {c.url ? (
        <a className="btn btn--primary btn--small" href={c.url} target="_blank" rel="noopener noreferrer">
          Join on WhatsApp
        </a>
      ) : (
        <span className="btn btn--primary btn--small connect-card__disabled-btn">Coming soon</span>
      )}
    </div>
  );
}

// "2026-11-28T15:00" -> { day: 28, month: "Nov" }
const shortDate = (dt) => {
  const d = new Date(`${dt.slice(0, 10)}T00:00`);
  return { day: d.getDate(), month: d.toLocaleString("en-US", { month: "short" }) };
};

// Maharaj Ji's upcoming programmes (events marked "aagami"), soonest first
function KathaList() {
  const { data: programs } = useFetch(() => api.getEvents({ aagami: 1, from: todayYmd() }));

  if (!programs) return null;
  if (!programs.length) {
    return <p className="connect-card__katha-empty">Upcoming katha dates will be announced soon.</p>;
  }

  return (
    <ul className="connect-card__kathas">
      {programs.map((e) => {
        const start = shortDate(e.start);
        const end = shortDate(e.end);
        const dates =
          e.start.slice(0, 10) === e.end.slice(0, 10)
            ? `${start.day} ${start.month}`
            : `${start.day} ${start.month} – ${end.day} ${end.month}`;
        return (
          <li key={e.id} className="connect-card__katha">
            <time className="connect-card__katha-date" dateTime={e.start.slice(0, 10)}>
              <span className="connect-card__katha-day">{start.day}</span>
              <span className="connect-card__katha-month">{start.month}</span>
            </time>
            <div className="connect-card__katha-info">
              <Link to={`/event/${e.slug}`} className="connect-card__katha-title">
                {e.title}
              </Link>
              <span className="connect-card__katha-meta">
                {dates}
                {!e.allDay && ` · ${timeLabel(e.start)}`}
              </span>
              <span className="connect-card__katha-place">
                <Icon name="pin" size={12} /> {e.venue.name}
                {e.venue.address && !e.venue.address.startsWith(e.venue.name) && `, ${e.venue.address}`}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
