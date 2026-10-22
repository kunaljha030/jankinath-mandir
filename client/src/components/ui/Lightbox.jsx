import { useEffect } from "react";
import Icon from "./Icons.jsx";
import "./Lightbox.css";

// Full-screen photo viewer. `index` null = closed. Arrow keys / Esc supported.
export default function Lightbox({ images, index, onChange, onClose }) {
  const open = index !== null && index !== undefined;
  const count = images.length;

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onChange((index + 1) % count);
      if (e.key === "ArrowLeft") onChange((index - 1 + count) % count);
    };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("no-scroll");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("no-scroll");
    };
  }, [open, index, count, onChange, onClose]);

  if (!open) return null;
  const image = images[index];

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={onClose}>
      <button className="lightbox__close" onClick={onClose} aria-label="Close">
        <Icon name="close" size={28} />
      </button>

      <button
        className="lightbox__nav lightbox__nav--prev"
        onClick={(e) => {
          e.stopPropagation();
          onChange((index - 1 + count) % count);
        }}
        aria-label="Previous photo"
      >
        <Icon name="arrowLeft" size={24} />
      </button>

      <figure className="lightbox__figure">
        <img key={image.image} src={image.image} alt={image.alt} onClick={(e) => e.stopPropagation()} />
        <figcaption>
          {image.alt} <span>{index + 1} / {count}</span>
        </figcaption>
      </figure>

      <button
        className="lightbox__nav lightbox__nav--next"
        onClick={(e) => {
          e.stopPropagation();
          onChange((index + 1) % count);
        }}
        aria-label="Next photo"
      >
        <Icon name="arrowRight" size={24} />
      </button>
    </div>
  );
}
