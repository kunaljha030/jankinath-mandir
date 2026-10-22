import Reveal from "../ui/Reveal.jsx";
import "./TopicTiles.css";

// Simple filled glyphs for the tiles (24x24 viewBox)
const icons = {
  book: "M3 4h6a3 3 0 013 3v13a2 2 0 00-2-2H3V4zm18 0h-6a3 3 0 00-3 3v13a2 2 0 012-2h7V4z",
  meditation:
    "M12 2a2.5 2.5 0 110 5 2.5 2.5 0 010-5zM8.5 8h7l1.2 5.2 3.3 2.3v2l-4.5-1.8V18h-7v-2.3L4 17.5v-2l3.3-2.3L8.5 8zM4 20h16v2H4z",
  lotus:
    "M12 3c1.9 3 3 6 3 9s-1.1 5.3-3 7.5C10.1 17.3 9 15 9 12s1.1-6 3-9zM3 10c3 .4 5.6 1.9 7.1 4.5.8 1.5 1.1 3 1.1 4.5-3-.4-5.2-1.5-6.7-3.7C3.4 13.8 3 12 3 10zm18 0c0 2-.4 3.8-1.5 5.3-1.5 2.2-3.7 3.3-6.7 3.7 0-1.5.3-3 1.1-4.5C15.4 11.9 18 10.4 21 10zM2 20h20v2H2z",
  people:
    "M9 4a3 3 0 110 6 3 3 0 010-6zm7 1a2.5 2.5 0 110 5 2.5 2.5 0 010-5zM2 19c0-3.3 3.1-6 7-6s7 2.7 7 6v1H2v-1zm15.5 1v-1c0-1.9-.7-3.6-1.9-4.9 3.6.2 6.4 2.5 6.4 5.4v.5h-4.5z",
  scroll:
    "M7 3h11a3 3 0 013 3v2h-4V6a1 1 0 00-2 0v12a3 3 0 01-3 3H6a3 3 0 01-3-3v-2h4V6a3 3 0 010-3zm2 4v2h4V7H9zm0 4v2h4v-2H9z",
  diya: "M12 2c2 2.8 3.5 4.8 3.5 7.2a3.5 3.5 0 01-7 0C8.5 6.8 10 4.8 12 2zM2 14h20c-.6 4-4.8 7-10 7S2.6 18 2 14z",
  bell: "M12 2a1 1 0 011 1v1.1A6 6 0 0118 10v5l2 2v1H4v-1l2-2v-5a6 6 0 015-5.9V3a1 1 0 011-1zm-2 18h4a2 2 0 01-4 0z",
  heart:
    "M12 21l-1.5-1.3C5.2 15 2 12.1 2 8.5 2 5.4 4.4 3 7.5 3c1.7 0 3.4.8 4.5 2.1C13.1 3.8 14.8 3 16.5 3 19.6 3 22 5.4 22 8.5c0 3.6-3.2 6.5-8.5 11.2L12 21z",
};

// Grid of topic tiles on the dark band under the Welcome video
export default function TopicTiles({ items }) {
  return (
    <section className="topic-tiles">
      <div className="container topic-tiles__grid">
        {items.map((item, i) => (
          <Reveal key={item.title} className="topic-tiles__item" delay={(i % 4) * 80}>
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d={icons[item.icon] || icons.lotus} />
            </svg>
            <h3>{item.title}</h3>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
