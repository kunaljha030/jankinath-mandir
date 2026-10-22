import { useEffect, useState } from "react";
import Icon from "../ui/Icons.jsx";

const VIEWS = [
  { id: "list", label: "List", icon: "list" },
  { id: "month", label: "Month", icon: "calendar" },
  { id: "day", label: "Day", icon: "day" },
];

// Search box + tab switcher (List / Month / Day by default; the blog passes its own tabs)
export default function EventsBar({
  search,
  view,
  onSearch,
  onView,
  views = VIEWS,
  placeholder = "Search for events",
  buttonLabel = "Find Events",
  tabsLabel = "Event views",
}) {
  const [text, setText] = useState(search);
  useEffect(() => setText(search), [search]);

  return (
    <div className="events-bar">
      <form
        className="events-bar__search"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch(text.trim());
        }}
      >
        <Icon name="search" size={18} className="events-bar__search-icon" />
        <label htmlFor="events-search" className="visually-hidden">
          {placeholder}
        </label>
        <input
          id="events-search"
          type="search"
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="btn btn--primary btn--small">
          {buttonLabel}
        </button>
      </form>

      <div className="events-bar__views" role="tablist" aria-label={tabsLabel}>
        {views.map((v) => (
          <button
            key={v.id}
            role="tab"
            aria-selected={view === v.id}
            className={`events-bar__view ${view === v.id ? "is-active" : ""}`}
            onClick={() => onView(v.id)}
          >
            {v.icon && <Icon name={v.icon} size={16} />}
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}
