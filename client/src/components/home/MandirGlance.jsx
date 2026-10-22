import Reveal from "../ui/Reveal.jsx";
import Button from "../ui/Button.jsx";
import "./MandirGlance.css";

// Shri Janki Nath Ji darshan photo + key facts about the mandir
export default function MandirGlance({ data }) {
  return (
    <section className="glance" lang="hi">
      <div className="glance__image" style={{ backgroundImage: `url(${data.image})` }}>
        <span className="glance__caption">{data.caption}</span>
      </div>

      <div className="glance__panel">
        <Reveal className="glance__content">
          <span className="glance__eyebrow">{data.eyebrow}</span>
          <h2 className="glance__title">{data.title}</h2>
          <p className="glance__text">{data.text}</p>

          <ul className="glance__facts">
            {data.facts.map((f) => (
              <li key={f.label} className="glance__fact">
                <strong>{f.value}</strong>
                <span>{f.label}</span>
              </li>
            ))}
          </ul>

          <div className="glance__actions">
            {data.buttons.map((b, i) => (
              <Button key={b.path} to={b.path} variant={i === 0 ? "primary" : "outline"}>
                {b.label}
              </Button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
