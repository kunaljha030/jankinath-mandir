import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSite } from "../../context/SiteContext.jsx";
import Icon from "../ui/Icons.jsx";
import OffcanvasMenu from "./OffcanvasMenu.jsx";
import "./Header.css";

export default function Header() {
  const site = useSite();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Header shrinks slightly and gets a stronger shadow once the page scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
        <div className="header__inner">
          <Link to="/" className="header__logo" aria-label="Home">
            <img src="/images/logo-jankinath.png" alt="" className="header__logo-badge" />
            <span className="header__logo-text">
              <strong>{site?.name}</strong>
              <small>{site?.subName}</small>
              <em className="header__tagline" lang="hi">{site?.tagline}</em>
            </span>
          </Link>

          <nav className="header__nav" aria-label="Main menu">
            <ul className="nav">
              {site?.menu.map((item) => (
                <li key={item.label} className={`nav__item ${item.children ? "nav__item--parent" : ""}`}>
                  <NavLink to={item.path} end={item.path === "/"} className="nav__link">
                    {item.label}
                  </NavLink>
                  {item.children && (
                    <ul className="nav__dropdown">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <Link to={child.path}>{child.label}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="header__actions">
            <Link to="/events" className="header__calendar">
              <Icon name="calendar" size={20} />
              <span>Calendar</span>
            </Link>
            <button
              className="header__burger"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="offcanvas-menu"
              aria-label="Open menu"
            >
              {/* drawn as an SVG with its own colour so every browser (iPhone Safari too) shows it */}
              <svg width="26" height="18" viewBox="0 0 26 18" aria-hidden="true">
                <rect y="0" width="26" height="2" rx="1" fill="currentColor" />
                <rect y="8" width="26" height="2" rx="1" fill="currentColor" />
                <rect y="16" width="26" height="2" rx="1" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / tablet menu */}
      <OffcanvasMenu open={menuOpen} onClose={() => setMenuOpen(false)} site={site} />
    </>
  );
}
