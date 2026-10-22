import { useState } from "react";
import Reveal from "../ui/Reveal.jsx";
import "./Welcome.css";

// Vidyalaya intro: grant line, title, trust line, motto + shloka, then the image that turns into the video in place
export default function Welcome({ data }) {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="welcome">
      <div className="container welcome__inner">
        {data.eyebrow && <Reveal className="welcome__eyebrow">{data.eyebrow}</Reveal>}
        <Reveal as="h2" className="welcome__title" delay={80}>
          {data.title}
        </Reveal>
        {data.subtitle && (
          <Reveal className="welcome__subtitle" delay={120}>
            {data.subtitle}
          </Reveal>
        )}
        {data.motto && (
          <Reveal className="welcome__motto" delay={160}>
            {data.motto}
          </Reveal>
        )}
        {data.quote && (
          <Reveal as="blockquote" className="welcome__quote" delay={200}>
            “ {data.quote} ”
          </Reveal>
        )}
      </div>

      <Reveal className="welcome__media container" delay={200}>
        {playing ? (
          <div className="welcome__image welcome__image--video">
            <iframe
              src={`${data.videoUrl}?autoplay=1`}
              title={data.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="welcome__image" style={{ backgroundImage: `url(${data.image})` }}>
            {data.videoUrl && (
              <button className="welcome__play" onClick={() => setPlaying(true)} aria-label="Play video">
                <span>Play</span>
              </button>
            )}
          </div>
        )}
      </Reveal>
    </section>
  );
}
