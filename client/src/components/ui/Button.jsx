import { Link } from "react-router-dom";
import "./Button.css";

/**
 * Theme button. Renders a router <Link> when `to` is given, otherwise a <button>.
 * variant: "primary" | "light" | "dark" | "outline"
 * size: "default" | "small"
 */
export default function Button({ to, variant = "primary", size = "default", className = "", children, ...rest }) {
  const classes = `btn btn--${variant} ${size === "small" ? "btn--small" : ""} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
