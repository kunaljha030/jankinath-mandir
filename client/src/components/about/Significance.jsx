import { useRef } from "react";
import SectionTitle from "../ui/SectionTitle.jsx";
import Icon, { LotusLogo } from "../ui/Icons.jsx";
import SignificanceIcon, { hasSignificanceIcon } from "./SignificanceIcons.jsx";
import "./TeamSlider.css";
import "./Significance.css";

// "Historical & Spiritual Significance": numbered cards (icon, title, tagline, text) in a
// scroll-snap slider with the same arrows as the Peeth Parampara slider
export default function Significance({ data }) {
  const trackRef = useRef(null);

  const scroll = (dir) => {
    const track = trackRef.current;
    const card = track.querySelector(".significance__card");
    const step = card ? card.offsetWidth + 30 : track.clientWidth;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;
    const atStart = track.scrollLeft <= 5;

    // Loop around at either end
    if (dir > 0 && atEnd) track.scrollTo({ left: 0, behavior: "smooth" });
    else if (dir < 0 && atStart) track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
    else track.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="section section--alt significance">
      <div className="container">
        <SectionTitle title={data.title} />

        <div className="team__slider">
          <button className="team__arrow team__arrow--prev" onClick={() => scroll(-1)} aria-label="Previous">
            <Icon name="arrowLeft" size={20} />
          </button>

          <div className="significance__track" ref={trackRef}>
            {data.items.map((item, i) => (
              <article key={item.title} className="significance__card" lang="hi">
                <span className="significance__number" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="significance__icon" aria-hidden="true">
                  {item.icon === "lotus" ? (
                    <LotusLogo size={34} />
                  ) : hasSignificanceIcon(item.icon) ? (
                    <SignificanceIcon name={item.icon} />
                  ) : (
                    <Icon name={item.icon} size={30} />
                  )}
                </span>
                <h3>{item.title}</h3>
                {item.hindi && <p className="significance__hindi">{item.hindi}</p>}
                <p>{item.text}</p>
              </article>
            ))}
          </div>

          <button className="team__arrow team__arrow--next" onClick={() => scroll(1)} aria-label="Next">
            <Icon name="arrowRight" size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
