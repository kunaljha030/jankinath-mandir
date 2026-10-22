import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Icon from "../ui/Icons.jsx";
import SocialLinks from "./SocialLinks.jsx";
import "./OffcanvasMenu.css";

// Mobile / tablet menu: white panel that slides in from the right
export default function OffcanvasMenu({ open, onClose, site }) {
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.classList.add("no-scroll");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("no-scroll");
    };
  }, [open, onClose]);

  const toggle = (label) => setExpanded((cur) => (cur === label ? null : label));

  return (
    <div id="offcanvas-menu" className={`offcanvas ${open ? "offcanvas--open" : ""}`} aria-hidden={!open}>
      {/* Click outside the panel to close */}
      <div className="offcanvas__backdrop" onClick={onClose} />

      <aside className="offcanvas__panel" aria-label="Menu">
        <div className="offcanvas__top">
          <span className="offcanvas__logo">
            <img src="/images/logo-jankinath.png" alt="" width="142" height="48" />
            <span>
              {site?.name}
              <small>{site?.subName}</small>
            </span>
          </span>
          <button className="offcanvas__close" onClick={onClose} aria-label="Close menu">
            <Icon name="close" size={22} />
          </button>
        </div>

        <nav className="offcanvas__nav" aria-label="Main menu">
          <ul>
            {site?.menu.map((item) => (
              <li key={item.label} className={expanded === item.label ? "is-expanded" : ""}>
                <div className="offcanvas__item">
                  <NavLink to={item.path} onClick={onClose} end>
                    {item.label}
                  </NavLink>
                  {item.children && (
                    <button
                      className="offcanvas__toggle"
                      onClick={() => toggle(item.label)}
                      aria-label={`Show ${item.label} submenu`}
                      aria-expanded={expanded === item.label}
                    >
                      <span />
                    </button>
                  )}
                </div>
                {item.children && (
                  <ul className="offcanvas__submenu">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <NavLink to={child.path} onClick={onClose} end>
                          {child.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="offcanvas__bottom">
          <p className="offcanvas__tagline" lang="hi">{site?.tagline}</p>
          <SocialLinks socials={site?.socials} />
        </div>
      </aside>
    </div>
  );
}
