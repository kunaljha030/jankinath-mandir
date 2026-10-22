import Button from "../ui/Button.jsx";
import Reveal from "../ui/Reveal.jsx";
import { LotusLogo } from "../ui/Icons.jsx";
import "./Invitation.css";

export default function Invitation({ data }) {
  return (
    <section className="invitation" lang="hi">
      <div className="invitation__image" style={{ backgroundImage: `url(${data.image})` }} />
      <div className="invitation__panel">
        <Reveal className="invitation__content">
          <LotusLogo size={54} />
          <p>{data.text}</p>
          <Button to={data.button.path} variant="dark">
            {data.button.label}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
