import { useEffect, useRef, useState } from "react";
import { api } from "../../services/api.js";
import Icon from "../ui/Icons.jsx";

// "Subscribe to calendar" button with Google / iCal / Outlook options
export default function SubscribeDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const icsUrl = api.eventsIcsUrl();
  // Calendar apps need a public address, so subscribing works once the site is online
  const feed = `${window.location.host}${icsUrl}`;

  const links = [
    { label: "Google Calendar", href: `https://calendar.google.com/calendar/r?cid=webcal://${feed}`, external: true },
    { label: "iCalendar", href: `webcal://${feed}` },
    { label: "Outlook 365", href: `https://outlook.office.com/owa?path=/calendar/action/compose&rru=addsubscription&url=webcal://${feed}&name=Mandir%20Events`, external: true },
    { label: "Outlook Live", href: `https://outlook.live.com/owa?path=/calendar/action/compose&rru=addsubscription&url=webcal://${feed}&name=Mandir%20Events`, external: true },
    { label: "Export .ics file", href: icsUrl, download: true },
    { label: "Export Outlook .ics file", href: icsUrl, download: true },
  ];

  return (
    <div className={`subscribe ${open ? "is-open" : ""}`} ref={ref}>
      <button className="subscribe__button" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        Subscribe to calendar
        <Icon name="chevronDown" size={16} />
      </button>
      {open && (
        <ul className="subscribe__menu">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}
                {...(l.download ? { download: "mandir-events.ics" } : {})}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
