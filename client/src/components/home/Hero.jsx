import { useEffect, useState } from "react";
import "./Hero.css";

const INTERVAL = 4000; // ms each photo stays in the centre
const SLIDE_MS = 800; // slide animation length

// Homepage carousel: the current Thakur Ji photo in the centre, the previous / next ones peeking
// in at the sides. Photos are shown close to their real size, so they stay sharp.
// Photos come from client/public/images/hero/ (see contentController.getHome).
export default function Hero({ data }) {
  const slides = data.slides?.length ? data.slides : [data.image];
  const n = slides.length;
  // Three copies in a row, starting on the middle one, so there is always a photo on both sides;
  // after moving onto the third copy we jump back to the same photo in the middle copy
  const track = n > 1 ? [...slides, ...slides, ...slides] : slides;
  const [index, setIndex] = useState(n > 1 ? n : 0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    if (n < 2) return;
    const id = setInterval(() => {
      setAnimate(true);
      setIndex((i) => i + 1);
    }, INTERVAL);
    return () => clearInterval(id);
  }, [n]);

  useEffect(() => {
    if (n < 2 || index < 2 * n) return;
    const id = setTimeout(() => {
      setAnimate(false);
      setIndex(index - n);
    }, SLIDE_MS);
    return () => clearTimeout(id);
  }, [index, n]);

  return (
    <section className="hero">
      {/* Visually hidden page heading for screen readers / SEO */}
      <h1 className="visually-hidden">{data.title}</h1>

      <div
        className="hero__track"
        style={{
          transform: `translateX(calc(-1 * (${index} * (var(--slide-w) + var(--slide-gap)) + var(--slide-w) / 2)))`,
          transition: animate ? `transform ${SLIDE_MS}ms ease-in-out` : "none",
        }}
      >
        {track.map((src, i) => (
          <div
            key={i}
            className={`hero__slide ${i === index ? "is-active" : ""}`}
            style={animate ? undefined : { transition: "none" }}
            aria-hidden={i !== index}
          >
            <img src={src} alt="" className="hero__photo" />
          </div>
        ))}
      </div>
    </section>
  );
}
