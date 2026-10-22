import { Link } from "react-router-dom";
import { useSite } from "../../context/SiteContext.jsx";
import Icon from "../ui/Icons.jsx";
import SocialLinks from "./SocialLinks.jsx";
import "./Footer.css";

// Menu items flattened for the footer: a parent with several real sub-pages ("Gallery") lists them;
// otherwise ("Programs" = list + calendar view of one page) the parent itself is listed
const footerLinks = (menu = []) =>
  menu.flatMap((item) => {
    const pages = (item.children || []).filter((c) => !c.path.includes("?"));
    return pages.length > 1 ? pages.map((c) => ({ ...c, key: c.path })) : [{ ...item, key: item.path }];
  });

// Three columns: logo + address | all pages | social links; copyright strip below
export default function Footer() {
  const site = useSite();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <img src="/images/logo-jankinath.png" alt="" width="178" height="60" />
            <span>{site?.fullName}</span>
            <small className="footer__tagline" lang="hi">{site?.tagline}</small>
          </Link>
          {site?.locations.map((loc) => (
            <div key={loc.title} className="footer__location">
              <Icon name="pin" size={18} className="footer__pin" />
              <p>{loc.lines.join(", ")}</p>
            </div>
          ))}
        </div>

        <nav className="footer__nav" aria-label="Footer">
          <ul>
            {footerLinks(site?.menu).map((link) => (
              <li key={link.key}>
                <Link to={link.path}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__social">
          <SocialLinks socials={site?.socials} />
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <p className="footer__copy">{site?.copyright.replace("{year}", year)}</p>
        </div>
      </div>
    </footer>
  );
}
