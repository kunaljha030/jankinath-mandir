import { useState } from "react";
import Reveal from "../ui/Reveal.jsx";
import Button from "../ui/Button.jsx";
import "./PeethIntro.css";

// Centered Hindi introduction under the hero. A block can also carry a `quote`
// (left, with the big quote mark) and a `card` (right, white with orange top border).
// Shows the first few lines; "Read More" drops the rest of the paragraph down below
function ExpandableText({ text }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <p className={`peeth-intro__text ${open ? "is-open" : ""}`}>{text}</p>
      <button type="button" className="peeth-intro__more" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {open ? "Read Less" : "Read More"}
        <span aria-hidden="true">{open ? "▴" : "▾"}</span>
      </button>
    </>
  );
}

export default function PeethIntro({ data }) {
  return (
    <section id="intro" className="peeth-intro">
      <div className="container peeth-intro__inner">
        {data.blocks.map((block, i) => (
          <div key={block.title} className="peeth-intro__block">
            <Reveal className="peeth-intro__head" delay={i * 100}>
              <span className="peeth-intro__eyebrow">{block.eyebrow}</span>
              <h2 className="peeth-intro__title">{block.title}</h2>
              {block.text?.map((para) => (
                <p key={para.slice(0, 30)}>{para}</p>
              ))}
            </Reveal>

            {(block.quote || block.card) && (
              <div className="peeth-intro__grid">
                {block.quote && (
                  <Reveal as="blockquote" className="peeth-intro__quote">
                    <span className="peeth-intro__mark" aria-hidden="true">“</span>
                    <ExpandableText text={block.quote.text} />
                    <cite>{block.quote.cite}</cite>
                  </Reveal>
                )}
                {block.card && (
                  <Reveal className="peeth-intro__card" delay={150}>
                    <span className="peeth-intro__card-eyebrow">{block.card.eyebrow}</span>
                    <h3>{block.card.title}</h3>
                    <p>{block.card.text}</p>
                    {block.card.button && <Button to={block.card.button.path}>{block.card.button.label}</Button>}
                  </Reveal>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
