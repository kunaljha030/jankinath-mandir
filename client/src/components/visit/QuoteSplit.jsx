import Reveal from "../ui/Reveal.jsx";
import "./QuoteSplit.css";

// Framed photo on the left; quote on the right with a large “ mark (like the Home intro)
export default function QuoteSplit({ data }) {
  return (
    <section className="section quote-split">
      <div className="container quote-split__inner">
        <Reveal className="quote-split__image">
          <img src={data.image} alt="" loading="lazy" />
        </Reveal>

        <Reveal as="blockquote" className="quote-split__quote" delay={150}>
          <span className="quote-split__mark" aria-hidden="true">“</span>
          <p className="quote-split__text" lang="hi">{data.text}</p>
          {data.translation && <p className="quote-split__translation">{data.translation}</p>}
          <footer>
            <cite>{data.author}</cite> · {data.source}
          </footer>
        </Reveal>
      </div>
    </section>
  );
}
