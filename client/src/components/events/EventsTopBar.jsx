import { useRef } from "react";
import Icon from "../ui/Icons.jsx";

/**
 * ← → arrows, "Today" button and the current date label.
 * Clicking the label opens a native date / month picker.
 */
export default function EventsTopBar({ label, pickerType, pickerValue, onPrev, onNext, onToday, onPick, isToday }) {
  const pickerRef = useRef(null);

  const openPicker = () => {
    const input = pickerRef.current;
    if (!input) return;
    if (input.showPicker) input.showPicker();
    else input.focus();
  };

  return (
    <div className="events-topbar">
      <div className="events-topbar__arrows">
        <button onClick={onPrev} aria-label="Previous">
          <Icon name="chevronLeft" size={18} />
        </button>
        <button onClick={onNext} aria-label="Next">
          <Icon name="chevronRight" size={18} />
        </button>
      </div>

      <button className="events-topbar__today" onClick={onToday} disabled={isToday}>
        Today
      </button>

      <div className="events-topbar__picker">
        <button className="events-topbar__label" onClick={openPicker}>
          {label}
          <Icon name="chevronDown" size={16} />
        </button>
        <input
          ref={pickerRef}
          type={pickerType}
          value={pickerValue}
          onChange={(e) => e.target.value && onPick(e.target.value)}
          className="events-topbar__input"
          aria-label="Select date"
          tabIndex={-1}
        />
      </div>
    </div>
  );
}
