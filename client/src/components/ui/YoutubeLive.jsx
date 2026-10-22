import { useEffect, useState } from "react";
import { api } from "../../services/api.js";
import Icon from "./Icons.jsx";
import "./YoutubeLive.css";

const POLL_MS = 2 * 60 * 1000;

// Plays the channel's live stream while it is on air, otherwise the latest video.
// Re-checks every 2 minutes so a stream that starts later shows up without a reload.
export default function YoutubeLive() {
  const [yt, setYt] = useState(null);

  useEffect(() => {
    let active = true;
    const load = () =>
      api
        .getYoutube()
        .then((data) => {
          const video = data.live || data.videos[0] || {};
          const next = { channelUrl: data.channelUrl, live: Boolean(data.live), ...video };
          active && setYt((prev) => (prev?.videoId === next.videoId && prev?.live === next.live ? prev : next));
        })
        .catch(() => {});
    load();
    const timer = setInterval(load, POLL_MS);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  if (!yt) return null;

  return (
    <div className="youtube-live">
      <div className="youtube-live__label">
        {yt.live ? (
          <span className="youtube-live__badge">
            <span className="youtube-live__dot" aria-hidden="true" /> LIVE
          </span>
        ) : (
          <span className="youtube-live__latest">Latest video</span>
        )}
        {yt.title && <span className="youtube-live__title">{yt.title}</span>}
      </div>

      {yt.videoId && (
        <div className="youtube-live__player">
          <iframe
            key={yt.videoId}
            src={`https://www.youtube.com/embed/${yt.videoId}${yt.live ? "?autoplay=1&mute=1" : ""}`}
            title={yt.title || "YouTube video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      <a className="btn btn--primary youtube-live__channel" href={yt.channelUrl} target="_blank" rel="noopener noreferrer">
        <Icon name="youtube" /> Subscribe on YouTube
      </a>
    </div>
  );
}
