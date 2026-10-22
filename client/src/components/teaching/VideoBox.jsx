import { useRef, useState } from "react";
import "./VideoBox.css";

const icons = {
  play: "M8 5v14l11-7z",
  pause: "M6 5h4v14H6zm8 0h4v14h-4z",
  volume: "M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 8v8a4.5 4.5 0 002.5-4z",
  muted: "M3 9v6h4l5 5V4L7 9H3zm18.6 0L20 7.4l-2.6 2.6-2.6-2.6L13.4 9l2.6 2.6-2.6 2.6 1.4 1.4 2.6-2.6 2.6 2.6 1.4-1.4-2.6-2.6z",
  fullscreen: "M4 4h6v2H6v4H4V4zm10 0h6v6h-2V6h-4V4zM4 14h2v4h4v2H4v-6zm14 0h2v6h-6v-2h4v-4z",
};

function Svg({ name, size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d={icons[name]} />
    </svg>
  );
}

const fmt = (s) => {
  if (!Number.isFinite(s)) return "00:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

// Video with the theme's player look: big ring play button + orange control bar
export default function VideoBox({ src, poster, title }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = () => {
    const v = ref.current;
    if (v.paused) v.play();
    else v.pause();
  };

  const seek = (e) => {
    const v = ref.current;
    v.currentTime = (Number(e.target.value) / 100) * (v.duration || 0);
  };

  const toggleMute = () => {
    ref.current.muted = !ref.current.muted;
    setMuted(ref.current.muted);
  };

  const fullscreen = () => {
    const v = ref.current;
    (v.requestFullscreen || v.webkitEnterFullscreen)?.call(v);
  };

  const progress = duration ? (time / duration) * 100 : 0;

  return (
    <div className={`video-box ${playing ? "is-playing" : ""}`}>
      <video
        ref={ref}
        src={src}
        poster={poster || undefined}
        preload="metadata"
        playsInline
        onClick={toggle}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />

      {!playing && (
        <button className="video-box__big-play" onClick={toggle} aria-label={`Play ${title}`}>
          <Svg name="play" size={30} />
        </button>
      )}

      <div className="video-box__bar">
        <button onClick={toggle} aria-label={playing ? "Pause" : "Play"}>
          <Svg name={playing ? "pause" : "play"} />
        </button>
        <span className="video-box__time">{fmt(time)}</span>
        <input
          className="video-box__progress"
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={progress}
          onChange={seek}
          style={{ "--progress": `${progress}%` }}
          aria-label="Seek"
        />
        <span className="video-box__time">{fmt(duration)}</span>
        <button onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"}>
          <Svg name={muted ? "muted" : "volume"} />
        </button>
        <button onClick={fullscreen} aria-label="Fullscreen">
          <Svg name="fullscreen" />
        </button>
      </div>
    </div>
  );
}
