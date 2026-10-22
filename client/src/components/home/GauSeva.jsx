import Reveal from "../ui/Reveal.jsx";
import Button from "../ui/Button.jsx";
import "./GauSeva.css";

// Gau seva appeal: photo card + shloka, text and donate button
export default function GauSeva({ data }) {
  return (
    <section className="section gau-seva" lang="hi">
      <div className="container gau-seva__inner">
        <Reveal className="gau-seva__photo">
          <img src={data.image} alt={data.imageAlt} loading="lazy" />
          <span className="gau-seva__badge">
            <strong>{data.badge.value}</strong>
            {data.badge.label}
          </span>
        </Reveal>

        <Reveal className="gau-seva__content" delay={120}>
          <span className="gau-seva__eyebrow">{data.eyebrow}</span>
          <h2 className="gau-seva__title">{data.title}</h2>
          <blockquote className="gau-seva__shloka">
            <p>{data.shloka}</p>
            <cite>{data.shlokaSource}</cite>
          </blockquote>
          <p className="gau-seva__text">{data.text}</p>
          <ul className="gau-seva__list">
            {data.points.map((pt) => (
              <li key={pt}>{pt}</li>
            ))}
          </ul>
          <Button to={data.button.path}>{data.button.label}</Button>
        </Reveal>
      </div>
    </section>
  );
}
