import { useEffect, useState } from "react";
import Icon from "../ui/Icons.jsx";
import "./BackToTop.css";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      className={`back-to-top ${visible ? "back-to-top--visible" : ""}`}
      onClick={() => window.scrollTo({ top: 0 })}
      aria-label="Back to top"
    >
      <Icon name="arrowUp" size={20} />
    </button>
  );
}
