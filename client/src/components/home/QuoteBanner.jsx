import { useEffect, useState } from "react";
import Reveal from "../ui/Reveal.jsx";
import "./QuoteBanner.css";

const ROTATE_MS = 6000;

// One quote, or several (`data.quotes`) that fade into each other every few seconds.
// All quotes sit in the same grid cell, so the section keeps the height of the longest one.
export default function QuoteBanner({ data }) {
  const quotes = data.quotes || [data];
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (quotes.length < 2 || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((i) => (i + 1) % quotes.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [quotes.length, paused]);

  return (
    <section className="quote-banner">
      <div className="container">
        <Reveal
          className="quote-banner__inner"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="quote-banner__stack">
            {quotes.map((q, i) => (
              <blockquote
                key={q.text}
                className={`quote-banner__quote ${i === active ? "is-active" : ""}`}
                aria-hidden={i !== active}
              >
                <p lang="hi">{q.text}</p>
                <cite>{q.author}</cite>
              </blockquote>
            ))}
          </div>

          {quotes.length > 1 && (
            <div className="quote-banner__dots">
              {quotes.map((q, i) => (
                <button
                  key={q.text}
                  type="button"
                  className={i === active ? "is-active" : ""}
                  onClick={() => setActive(i)}
                  aria-label={`Quote ${i + 1}`}
                />
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
