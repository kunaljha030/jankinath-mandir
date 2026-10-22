import { useEffect, useState } from "react";
import Reveal from "../ui/Reveal.jsx";
import "./NaamJap.css";

const MALA = 108;
const STORE = "naam-jap-count";
const R = 54; // progress ring radius
const RING = 2 * Math.PI * R;

// Saved count, per viewer (storage may be blocked)
function loadCount() {
  try {
    return Number(localStorage.getItem(STORE)) || 0;
  } catch {
    return 0;
  }
}

// Framed photo on the left; mantra with a large “ mark and the tap counter on the right
// (same layout as the Visit page quote)
export default function NaamJap({ data }) {
  const [count, setCount] = useState(loadCount);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem(STORE, String(count));
    } catch {
      /* ignore */
    }
  }, [count]);

  const bead = count % MALA;
  const malas = Math.floor(count / MALA);
  const justFinished = count > 0 && bead === 0;
  const shown = justFinished ? MALA : bead;

  const jap = () => {
    setCount((c) => c + 1);
    setPulse((p) => p + 1);
  };

  return (
    <section className="section naam-jap" lang="hi">
      <div className="container naam-jap__inner">
        <Reveal className="naam-jap__image">
          <img src={data.image} alt="" loading="lazy" />
        </Reveal>

        <Reveal className="naam-jap__content" delay={150}>
          <span className="naam-jap__mark" aria-hidden="true">“</span>
          <span className="naam-jap__eyebrow">{data.title}</span>
          <p className="naam-jap__mantra">{data.mantra}॥</p>
          <p className="naam-jap__text">{data.text}</p>

          <div className="naam-jap__row">
            <div className="naam-jap__counter">
              <svg className="naam-jap__ring" viewBox="0 0 124 124" aria-hidden="true">
                <circle cx="62" cy="62" r={R} className="naam-jap__track" />
                <circle
                  cx="62"
                  cy="62"
                  r={R}
                  className="naam-jap__progress"
                  strokeDasharray={RING}
                  strokeDashoffset={RING * (1 - shown / MALA)}
                />
              </svg>
              <button
                className={`naam-jap__btn ${pulse % 2 ? "is-tap-a" : pulse ? "is-tap-b" : ""}`}
                onClick={jap}
                aria-label="राम नाम जप करें"
              >
                <span className="naam-jap__ram">राम</span>
                <span className="naam-jap__bead">
                  {shown} / {MALA}
                </span>
              </button>
            </div>

            <div className="naam-jap__stats">
              <p className="naam-jap__hint">{justFinished ? data.malaDone : data.hint}</p>
              <p>
                पूर्ण माला <strong>{malas}</strong>
                <span aria-hidden="true">·</span>
                कुल जाप <strong>{count}</strong>
              </p>
              {count > 0 && (
                <button className="naam-jap__reset" onClick={() => setCount(0)}>
                  पुनः आरम्भ
                </button>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
