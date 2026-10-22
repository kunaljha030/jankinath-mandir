import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "../ui/Reveal.jsx";
import SectionTitle from "../ui/SectionTitle.jsx";
import Icon from "../ui/Icons.jsx";
import "./TeamSlider.css";
import "./ServicesFeatured.css";

const AUTOPLAY_MS = 6000;

/**
 * Service cards: image on top, title, short text and a "more" link.
 * Grid of 3 by default; `slider` turns it into an auto-playing slider (pauses on hover/focus).
 * `lang="hi"` switches to the Hindi font and labels.
 */
export default function ServicesFeatured({ items, title, slider = false, lang }) {
  const hindi = lang === "hi";
  // Hindi cards have no "more" link; the image and title still link to the page
  const labels = hindi ? { view: "देखें" } : { view: "View", more: "Learn" };

  const cards = items.map((item, i) => {
    const card = (
      <>
        <Link to={item.path} className="service-card__image">
          <img src={item.image} alt={item.title} loading="lazy" />
          <span className="service-card__view">{labels.view}</span>
        </Link>
        <div className="service-card__body">
          <h4>
            <Link to={item.path}>{item.title}</Link>
          </h4>
          <p>{item.text}</p>
          {!hindi && (
            <Link to={item.path} className="link-more">
              {labels.more}
            </Link>
          )}
        </div>
      </>
    );
    return slider ? (
      <article key={item.title} className="service-card">
        {card}
      </article>
    ) : (
      <Reveal as="article" key={item.title} className="service-card" delay={i * 120}>
        {card}
      </Reveal>
    );
  });

  return (
    <section className={`section section--alt services-featured ${hindi ? "services-featured--hi" : ""}`} lang={lang}>
      {title && (
        <div className="container">
          <SectionTitle title={title} />
        </div>
      )}
      <div className="container">
        {slider ? <AutoSlider>{cards}</AutoSlider> : <div className="services-featured__grid">{cards}</div>}
      </div>
    </section>
  );
}

// Scroll-snap track that moves one card every few seconds and loops back to the start
function AutoSlider({ children }) {
  const trackRef = useRef(null);
  const [paused, setPaused] = useState(false);

  const scroll = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector(".service-card");
    const step = card ? card.offsetWidth + 30 : track.clientWidth;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;
    const atStart = track.scrollLeft <= 5;

    if (dir > 0 && atEnd) track.scrollTo({ left: 0, behavior: "smooth" });
    else if (dir < 0 && atStart) track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
    else track.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => scroll(1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div
      className="team__slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <button className="team__arrow team__arrow--prev" onClick={() => scroll(-1)} aria-label="Previous">
        <Icon name="arrowLeft" size={20} />
      </button>
      <div className="services-featured__track" ref={trackRef}>
        {children}
      </div>
      <button className="team__arrow team__arrow--next" onClick={() => scroll(1)} aria-label="Next">
        <Icon name="arrowRight" size={20} />
      </button>
    </div>
  );
}
