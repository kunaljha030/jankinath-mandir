import Reveal from "../ui/Reveal.jsx";
import "./LocationInfo.css";

// Thin line icons for the info cards (24x24, stroked)
const icons = {
  address: (
    <>
      <path d="M12 21s-6-5.6-6-11a6 6 0 0112 0c0 5.4-6 11-6 11z" />
      <circle cx="12" cy="10" r="2.2" />
      <path d="M5 21h14" />
    </>
  ),
  hours: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="6" r="2" />
      <path d="M8 18h7a3 3 0 000-6H9a3 3 0 010-6h7" />
    </>
  ),
  temple: (
    <>
      <path d="M12 2v3M8 9l4-4 4 4M6 9h12M7 9v11M17 9v11M4 20h16M10 20v-5h4v5" />
    </>
  ),
};

// "Visiting" info cards (address, timings, how to reach, nearby) + Google map
export default function LocationInfo({ data }) {
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(data.mapQuery)}&z=14&output=embed`;

  return (
    <section className="section location-info">
      <div className="container">
        <div className="location-info__cards">
          {data.cards.map((card, i) => (
            <Reveal key={card.title} className="location-info__card" delay={i * 80}>
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {icons[card.icon] || icons.address}
              </svg>
              <h3>{card.title}</h3>
              {card.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </Reveal>
          ))}
        </div>

        <Reveal className="location-info__map" delay={150}>
          <iframe src={mapSrc} title="Mandir location on Google Maps" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </Reveal>
      </div>
    </section>
  );
}
