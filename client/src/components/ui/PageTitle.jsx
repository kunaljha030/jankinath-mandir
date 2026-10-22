import { Link } from "react-router-dom";
import "./PageTitle.css";

/**
 * Banner at the top of inner pages: big title + breadcrumbs.
 * crumbs: [{ label, path }] — the last item is the current page (no link).
 */
export default function PageTitle({ title, image, imagePosition = "center", crumbs = [] }) {
  return (
    <section
      className="page-title"
      style={image ? { backgroundImage: `url(${image})`, backgroundPosition: imagePosition } : undefined}
    >
      <div className="page-title__overlay" />
      <div className="container page-title__content">
        <h1>{title}</h1>
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          {crumbs.map((c, i) =>
            i === crumbs.length - 1 ? (
              <span key={c.label} className="breadcrumbs__current" aria-current="page">
                {c.label}
              </span>
            ) : (
              <Link key={c.label} to={c.path}>
                {c.label}
              </Link>
            )
          )}
        </nav>
      </div>
    </section>
  );
}
