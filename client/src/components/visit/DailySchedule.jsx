import Button from "../ui/Button.jsx";
import Reveal from "../ui/Reveal.jsx";
import "./DailySchedule.css";

// Timetable on the left, framed photo on the right (photo shown uncropped)
export default function DailySchedule({ data }) {
  return (
    <section className="section schedule">
      <div className="container schedule__grid">
        <Reveal className="schedule__content">
          <span className="schedule__subtitle">{data.subtitle}</span>
          <h2>{data.title}</h2>
          <p className="schedule__text">{data.text}</p>

          <table className="schedule__table">
            <tbody>
              {data.rows.map((row) => (
                <tr key={row.time + row.activity}>
                  <th scope="row">{row.time}</th>
                  <td>{row.activity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Button to={data.button.path}>{data.button.label}</Button>
        </Reveal>

        <Reveal className="schedule__media" delay={150}>
          <div className="schedule__image">
            <img src={data.image} alt="" loading="lazy" />
            <span className="schedule__frame" aria-hidden="true" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
