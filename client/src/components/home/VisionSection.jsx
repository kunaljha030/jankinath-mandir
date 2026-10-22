import { useState } from "react";
import Reveal from "../ui/Reveal.jsx";
import VideoModal from "../ui/VideoModal.jsx";
import "./VisionSection.css";

export default function VisionSection({ data }) {
  const [videoOpen, setVideoOpen] = useState(false);
  // one line per half of the doha (split after the "।")
  const quoteLines = data.quote.split(/(?<=।)\s*/);

  return (
    <section className="vision" lang="hi">
      {/* Full-width image banner with the play button */}
      <div className="vision__banner" style={{ backgroundImage: `url(${data.image})` }}>
        <div className="vision__overlay" />
        <Reveal className="vision__banner-content container">
          <h2 className="vision__title">{data.title}</h2>
          <button className="vision__play" onClick={() => setVideoOpen(true)}>
            <span>{data.playLabel || "Play"}</span>
          </button>
        </Reveal>
      </div>

      {/* Sankalp card overlapping the banner: text on the left, doha on the right */}
      <div className="container vision__wrap">
        <Reveal className="vision__card">
          <div className="vision__text">
            <span className="vision__subtitle">{data.subtitle}</span>
            <span className="vision__divider" aria-hidden="true" />
            <p>{data.text}</p>
          </div>
          <blockquote className="vision__quote">
            <span className="vision__mark" aria-hidden="true">“</span>
            <p>
              {quoteLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
            <cite>{data.quoteAuthor}</cite>
          </blockquote>
        </Reveal>
      </div>

      <VideoModal url={videoOpen ? data.videoUrl : null} onClose={() => setVideoOpen(false)} />
    </section>
  );
}
