import { useMemo, useState } from "react";
import Icon from "../ui/Icons.jsx";
import { panchang, todayInIndia } from "../../utils/panchang.js";

const MONTHS = [
  "जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून",
  "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर",
];
const WEEK = ["र", "सो", "मं", "बु", "गु", "शु", "श"];


// Short label under each date: tithi number, "पू" for purnima, "अ" for amavasya
const shortTithi = (p) => (p.purnima ? "पू" : p.amavasya ? "अ" : p.tithiNum.toLocaleString("hi-IN-u-nu-deva"));

export default function PanchangCard({ data }) {
  const today = useMemo(todayInIndia, []);
  const [view, setView] = useState({ y: today.y, m: today.m });
  const [picked, setPicked] = useState(today);

  const days = useMemo(() => {
    const count = new Date(view.y, view.m, 0).getDate();
    return Array.from({ length: count }, (_, i) => ({ d: i + 1, p: panchang(view.y, view.m, i + 1) }));
  }, [view]);
  const lead = new Date(view.y, view.m - 1, 1).getDay();
  const sel = panchang(picked.y, picked.m, picked.d);

  const shift = (n) =>
    setView(({ y, m }) => {
      const t = new Date(y, m - 1 + n, 1);
      return { y: t.getFullYear(), m: t.getMonth() + 1 };
    });
  const isToday = (d) => view.y === today.y && view.m === today.m && d === today.d;
  const isPicked = (d) => view.y === picked.y && view.m === picked.m && d === picked.d;

  return (
    <>
      <span className="darshan-card__icon">
        <Icon name="calendar" size={22} />
      </span>
      <h3 className="darshan-card__title">{data.title}</h3>

      {/* Selected day */}
      <div className="panchang__day">
        <span className="panchang__date">
          {sel.vaar}, {picked.d} {MONTHS[picked.m - 1]} {picked.y}
        </span>
        <strong className="panchang__tithi">
          {sel.maas} {sel.paksha.split(" ")[0]} {sel.tithi}
        </strong>
        <span className="panchang__meta">
          नक्षत्र: {sel.nakshatra} · वि.सं. {sel.samvat} · सूर्योदय {sel.sunrise}
        </span>
        {(sel.ekadashi || sel.purnima || sel.amavasya) && (
          <span className="panchang__vrat">{sel.ekadashi ? "एकादशी व्रत" : sel.purnima ? "पूर्णिमा" : "अमावस्या"}</span>
        )}
      </div>

      {/* Month grid with the tithi under each date */}
      <div className="panchang__nav">
        <button type="button" onClick={() => shift(-1)} aria-label="पिछला महीना">
          <Icon name="chevronLeft" size={18} />
        </button>
        <span>
          {MONTHS[view.m - 1]} {view.y}
        </span>
        <button type="button" onClick={() => shift(1)} aria-label="अगला महीना">
          <Icon name="chevronRight" size={18} />
        </button>
      </div>
      <div className="panchang__grid">
        {WEEK.map((w) => (
          <span key={w} className="panchang__wd">
            {w}
          </span>
        ))}
        {Array.from({ length: lead }, (_, i) => (
          <span key={`e${i}`} />
        ))}
        {days.map(({ d, p }) => (
          <button
            type="button"
            key={d}
            onClick={() => setPicked({ y: view.y, m: view.m, d })}
            className={[
              "panchang__cell",
              p.shukla ? "is-shukla" : "is-krishna",
              p.ekadashi && "is-ekadashi",
              (p.purnima || p.amavasya) && "is-special",
              isToday(d) && "is-today",
              isPicked(d) && "is-picked",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-label={`${d} ${MONTHS[view.m - 1]}: ${p.paksha} ${p.tithi}`}
          >
            <span>{d}</span>
            <small>{shortTithi(p)}</small>
          </button>
        ))}
      </div>
      <p className="panchang__legend" title={data.note}>
        <i className="is-shukla" /> शुक्ल <i className="is-krishna" /> कृष्ण <i className="is-ekadashi" /> एकादशी
        <em>* सूर्योदय अनुसार</em>
      </p>
    </>
  );
}
