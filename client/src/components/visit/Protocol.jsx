import Reveal from "../ui/Reveal.jsx";
import { LotusLogo } from "../ui/Icons.jsx";
import "./Protocol.css";

// Title, then two columns: intro + first half of the list | second half of the list
export default function Protocol({ data }) {
  const half = Math.ceil(data.items.length / 2);
  const columns = [data.items.slice(0, half), data.items.slice(half)];

  return (
    <section className="section section--alt protocol">
      <div className="container">
        <Reveal>
          <h2 className="protocol__title">{data.title}</h2>
        </Reveal>

        <div className="protocol__grid">
          <Reveal className="protocol__col">
            <p className="protocol__intro">{data.intro}</p>
            <ProtocolList items={columns[0]} />
          </Reveal>
          <Reveal className="protocol__col" delay={150}>
            <ProtocolList items={columns[1]} />
            {data.note && <p className="protocol__note">{data.note}</p>}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ProtocolList({ items }) {
  return (
    <ul className="protocol__list">
      {items.map((item) => (
        <li key={item}>
          <span className="protocol__bullet" aria-hidden="true">
            <LotusLogo size={18} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}
