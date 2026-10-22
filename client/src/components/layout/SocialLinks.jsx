import Icon from "../ui/Icons.jsx";
import "./SocialLinks.css";

export default function SocialLinks({ socials = [] }) {
  return (
    <ul className="socials">
      {socials.map((s) => (
        <li key={s.name} className={`socials__item socials__item--${s.name}`}>
          {s.url ? (
            <a href={s.url} target="_blank" rel="noreferrer" aria-label={s.name}>
              <Icon name={s.name} size={16} />
            </a>
          ) : (
            // No link yet (e.g. WhatsApp channel not started): show the icon greyed out
            <span className="socials__soon" title="Coming soon" aria-label={`${s.name} (coming soon)`}>
              <Icon name={s.name} size={16} />
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
