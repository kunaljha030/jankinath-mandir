import { useEffect } from "react";
import Icon from "./Icons.jsx";
import "./VideoModal.css";

export default function VideoModal({ url, onClose }) {
  useEffect(() => {
    if (!url) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.classList.add("no-scroll");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("no-scroll");
    };
  }, [url, onClose]);

  if (!url) return null;

  return (
    <div className="video-modal" role="dialog" aria-modal="true" aria-label="Video" onClick={onClose}>
      <div className="video-modal__inner" onClick={(e) => e.stopPropagation()}>
        <button className="video-modal__close" onClick={onClose} aria-label="Close video">
          <Icon name="close" size={28} />
        </button>
        <iframe
          src={`${url}?autoplay=1`}
          title="Video"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
