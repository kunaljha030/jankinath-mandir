import Icon from "../ui/Icons.jsx";

// Bottom navigation: "‹ Previous Events   Today   Next Events ›"
export default function EventsNav({ prevLabel, nextLabel, onPrev, onNext, onToday, prevDisabled, nextDisabled }) {
  return (
    <nav className="events-nav" aria-label="Events navigation">
      <button className="events-nav__link" onClick={onPrev} disabled={prevDisabled}>
        <Icon name="chevronLeft" size={16} />
        {prevLabel}
      </button>
      {onToday ? (
        <button className="events-nav__today" onClick={onToday}>
          Today
        </button>
      ) : (
        <span />
      )}
      <button className="events-nav__link events-nav__link--next" onClick={onNext} disabled={nextDisabled}>
        {nextLabel}
        <Icon name="chevronRight" size={16} />
      </button>
    </nav>
  );
}
