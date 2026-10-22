import { Link } from "react-router-dom";
import Reveal from "../ui/Reveal.jsx";
import "./FeatureCards.css";

export default function FeatureCards({ items }) {
  return (
    <section className="features">
      <div className="container features__grid">
        {items.map((item, i) => (
          <Reveal key={item.title} delay={i * 120}>
            <Link to={item.path} className="feature-card">
              <div className="feature-card__image">
                <img src={item.image} alt={item.title} loading="lazy" />
              </div>
              <div className="feature-card__body" lang="hi">
                <h4>{item.title}</h4>
                <span className="link-more">देखें</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
