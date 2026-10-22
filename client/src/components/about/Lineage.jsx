import Reveal from "../ui/Reveal.jsx";
import { LotusLogo } from "../ui/Icons.jsx";
import "./Lineage.css";

// "Lineage and Leadership": text + activities on the left, highlight card for the current Peethadhishwar
export default function Lineage({ data }) {
  const { leader } = data;

  return (
    <section className="section lineage">
      <div className="container lineage__grid">
        <Reveal className="lineage__text">
          {data.subtitle && <span className="lineage__subtitle">{data.subtitle}</span>}
          <h2 className="lineage__title">“{data.title}”</h2>
          <p className="lineage__lead">{data.text}</p>

          <p className="lineage__activities-title">{data.activitiesTitle}</p>
          <ul className="lineage__activities">
            {data.activities.map((a) => (
              <li key={a}>
                <LotusLogo size={20} />
                {a}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal as="aside" className="lineage__card" delay={150}>
          {leader.image ? (
            <img src={leader.image} alt={leader.name} className="lineage__photo" />
          ) : (
            <img src="/images/logo-jankinath.png" alt="" className="lineage__logo" />
          )}
          <span className="lineage__badge">{leader.badge}</span>
          <h3>{leader.name}</h3>
          <p className="lineage__role">{leader.role}</p>
          <p className="lineage__since">{leader.since}</p>
          <p className="lineage__note">{leader.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
