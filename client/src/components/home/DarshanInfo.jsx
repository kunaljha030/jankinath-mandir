import { useEffect, useRef, useState } from "react";
import Reveal from "../ui/Reveal.jsx";
import Icon from "../ui/Icons.jsx";
import SectionTitle from "../ui/SectionTitle.jsx";
import PanchangCard from "./PanchangCard.jsx";
import { EkadashiCard, MahotsavCard } from "./FestivalCards.jsx";
import "../about/TeamSlider.css";
import "./DarshanInfo.css";

// "16:00" -> minutes since midnight
const toMin = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

// "18:30" -> "सायं 6:30"
function hindiTime(t) {
  const [h, m] = t.split(":").map(Number);
  const period = h < 12 ? "प्रातः" : h < 16 ? "दोपहर" : h < 19 ? "सायं" : "रात्रि";
  return `${period} ${h % 12 || 12}:${String(m).padStart(2, "0")}`;
}

// Current time at the mandir (India), in minutes since midnight
function nowInIndia() {
  const [h, m] = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  })
    .format(new Date())
    .split(":")
    .map(Number);
  return h * 60 + m;
}

function useIndiaClock() {
  const [now, setNow] = useState(nowInIndia);
  useEffect(() => {
    const id = setInterval(() => setNow(nowInIndia()), 30000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export default function DarshanInfo({ data }) {
  const now = useIndiaClock();
  const trackRef = useRef(null);

  // One card per step, looping around at either end
  const scroll = (dir) => {
    const track = trackRef.current;
    const card = track.querySelector(".darshan-card");
    const step = card ? card.offsetWidth + 28 : track.clientWidth;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;
    const atStart = track.scrollLeft <= 5;
    if (dir > 0 && atEnd) track.scrollTo({ left: 0, behavior: "smooth" });
    else if (dir < 0 && atStart) track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
    else track.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const open = data.sessions.find((s) => now >= toMin(s.from) && now < toMin(s.to));
  const nextOpen = data.sessions.find((s) => toMin(s.from) > now) || data.sessions[0];
  const nextAarti = data.aartis.find((a) => toMin(a.time) > now) || data.aartis[0];

  return (
    <section className="section darshan-info" lang="hi">
      <div className="container darshan-info__container">
        <SectionTitle title={data.title} subtitle={data.subtitle} />

        <Reveal className="team__slider darshan-info__slider">
          <button className="team__arrow team__arrow--prev" onClick={() => scroll(-1)} aria-label="पिछला">
            <Icon name="arrowLeft" size={20} />
          </button>

          <div className="darshan-info__track" ref={trackRef}>
            {/* Main aartis (the next one highlighted) with the live open / closed status */}
            <div className="darshan-card">
              <span className="darshan-card__icon">
                <Icon name="star" size={22} />
              </span>
              <h3 className="darshan-card__title">{data.aartiTitle}</h3>
              <span className={`darshan-status ${open ? "darshan-status--open" : "darshan-status--closed"}`}>
                <i aria-hidden="true" />
                {open
                  ? `अभी दर्शन खुले हैं · ${hindiTime(open.to)} तक`
                  : `अभी दर्शन बंद हैं · ${hindiTime(nextOpen.from)} बजे खुलेंगे`}
              </span>
              <ul className="darshan-card__rows darshan-card__rows--aarti">
                {data.aartis.map((a) => (
                  <li key={a.time} className={a === nextAarti ? "is-next" : ""}>
                    <span>{a.name}</span>
                    <strong>{hindiTime(a.time)}</strong>
                    {a === nextAarti && <em>अगली आरती</em>}
                  </li>
                ))}
              </ul>
            </div>

            {/* The dham's main utsavs */}
            <div className="darshan-card">
              <MahotsavCard data={data.mahotsav} />
            </div>

            {/* Hindu panchang: tithi for each date */}
            <div className="darshan-card">
              <PanchangCard data={data.panchang} />
            </div>

            {/* Upcoming ekadashis */}
            <div className="darshan-card">
              <EkadashiCard data={data.ekadashi} />
            </div>
          </div>

          <button className="team__arrow team__arrow--next" onClick={() => scroll(1)} aria-label="अगला">
            <Icon name="arrowRight" size={20} />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
