import { useState } from "react";
import Reveal from "./Reveal.jsx";
import Lightbox from "./Lightbox.jsx";
import "./PhotoGrid.css";

/**
 * Mosaic ("cobbles") photo grid with a round "View" button on hover and a lightbox on click.
 * pattern: "data"   — photos with size "large" span 2x2 (Latest Photos)
 *          "repeat" — every 3rd photo starting with the first is large: L s s L s s … (Gallery page)
 * variant: "default" (4 cols, 30px gap) | "gallery" (4/3/1 cols, 20px gap)
 */
export default function PhotoGrid({ photos, pattern = "data", variant = "default" }) {
  const [openIndex, setOpenIndex] = useState(null);

  const isLarge = (photo, i) => (pattern === "repeat" ? i % 3 === 0 : photo.size === "large");

  return (
    <>
      <Reveal className={`photo-grid photo-grid--${variant}`}>
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            className={`photo-grid__item ${isLarge(photo, i) ? "photo-grid__item--large" : ""}`}
            onClick={() => setOpenIndex(i)}
            aria-label={`View photo: ${photo.alt}`}
          >
            <img src={photo.image} alt={photo.alt} loading="lazy" />
            <span className="photo-grid__overlay" aria-hidden="true">
              <span className="photo-grid__view">View</span>
            </span>
          </button>
        ))}
      </Reveal>

      <Lightbox images={photos} index={openIndex} onChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
    </>
  );
}
