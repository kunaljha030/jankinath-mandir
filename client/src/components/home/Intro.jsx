import Button from "../ui/Button.jsx";
import Reveal from "../ui/Reveal.jsx";
import "./Intro.css";

// Quote + "Getting the Mind Ready" call to action right under the hero
export default function Intro({ data }) {
  return (
    <section className="intro section--alt">
      <div className="container intro__grid">
        <Reveal as="blockquote" className="intro__quote">
          <span className="intro__mark" aria-hidden="true">“</span>
          <p>{data.quote}</p>
          <cite>{data.author}</cite>
        </Reveal>

        <Reveal className="intro__cta" delay={150}>
          <h3>{data.title}</h3>
          <Button to={data.button.path}>{data.button.label}</Button>
        </Reveal>
      </div>
    </section>
  );
}
