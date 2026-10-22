import "./SectionTitle.css";

// Section heading with the small lotus divider used throughout the theme.
export default function SectionTitle({ title, subtitle, align = "center", light = false, as: Tag = "h2" }) {
  return (
    <div className={`section-title section-title--${align} ${light ? "section-title--light" : ""}`}>
      {subtitle && <span className="section-title__subtitle">{subtitle}</span>}
      <Tag className="section-title__title">{title}</Tag>
      <span className="section-title__divider" aria-hidden="true">
        <svg viewBox="0 0 64 64">
          <path d="M32 10c4 7 6 13 6 19s-2 11-6 16c-4-5-6-10-6-16s2-12 6-19zM12 28c6 1 11 4 14 9 2 3 3 6 3 9-6-1-10-3-13-8-3-3-4-7-4-10zm40 0c0 3-1 7-4 10-3 5-7 7-13 8 0-3 1-6 3-9 3-5 8-8 14-9z" />
        </svg>
      </span>
    </div>
  );
}
