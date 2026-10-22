import { Link } from "react-router-dom";
import Reveal from "../ui/Reveal.jsx";
import DonationProgress from "./DonationProgress.jsx";

// One card in the Donation Causes grid; the whole card links to the cause page
export default function CauseCard({ cause, delay }) {
  return (
    <Reveal as="article" className="cause-card" delay={delay}>
      <Link to={`/donate/${cause.slug}`} className="cause-card__link" aria-label={`दान करें: ${cause.title}`}>
        <div className="cause-card__image">
          <img src={cause.image} alt="" loading="lazy" />
        </div>
        <div className="cause-card__body" lang="hi">
          <h3 className="cause-card__title">{cause.title}</h3>
          <p className="cause-card__text">{cause.excerpt}</p>
          <span className="cause-card__donate">दान करें</span>
          <DonationProgress {...cause} />
        </div>
      </Link>
    </Reveal>
  );
}
