import { useRef } from "react";
import SectionTitle from "../ui/SectionTitle.jsx";
import Icon from "../ui/Icons.jsx";
import "./TeamSlider.css";

// Horizontal slider built on CSS scroll-snap; arrows scroll by one card
export default function TeamSlider({ title, subtitle, members }) {
  const trackRef = useRef(null);

  const scroll = (dir) => {
    const track = trackRef.current;
    const card = track.querySelector(".team-card");
    const step = card ? card.offsetWidth + 30 : track.clientWidth;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;
    const atStart = track.scrollLeft <= 5;

    // Loop around at either end
    if (dir > 0 && atEnd) track.scrollTo({ left: 0, behavior: "smooth" });
    else if (dir < 0 && atStart) track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
    else track.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="section team">
      <div className="container">
        <SectionTitle title={title} subtitle={subtitle} />

        <div className="team__slider">
          <button className="team__arrow team__arrow--prev" onClick={() => scroll(-1)} aria-label="Previous">
            <Icon name="arrowLeft" size={20} />
          </button>

          <div className="team__track" ref={trackRef}>
            {members.map((m) => (
              <article key={m.name} className="team-card">
                <div className="team-card__image">
                  <img src={m.image} alt={m.name} loading="lazy" />
                </div>
                <h5 className="team-card__name">{m.name}</h5>
                <div className="team-card__role">{m.role}</div>
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
