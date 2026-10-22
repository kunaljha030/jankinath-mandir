import { useState } from "react";
import Reveal from "../ui/Reveal.jsx";
import "./HistoryTabs.css";

// "Our History": image on the left, year tabs + text on the right
export default function HistoryTabs({ data }) {
  const [active, setActive] = useState(0);
  const tab = data.tabs[active];

  return (
    <section className="section history">
      <div className="container history__grid">
        <Reveal className="history__image">
          <img src={data.image} alt="" loading="lazy" />
          <span className="history__frame" aria-hidden="true" />
        </Reveal>

        <Reveal className="history__body" delay={150}>
          <h2>{data.title}</h2>
          {data.intro && <p className="history__intro">{data.intro}</p>}

          <div className="history__tabs" role="tablist">
            {data.tabs.map((t, i) => (
              <button
                key={t.label}
                role="tab"
                id={`history-tab-${i}`}
                aria-selected={i === active}
                aria-controls="history-panel"
                className={`history__tab ${i === active ? "is-active" : ""}`}
                onClick={() => setActive(i)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div
            key={active}
            id="history-panel"
            role="tabpanel"
            aria-labelledby={`history-tab-${active}`}
            className="history__panel"
          >
            <span className="history__year">{tab.label}</span>
            <h4>{tab.title}</h4>
            <p>{tab.text}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
