import { useMemo } from "react";
import Icon from "../ui/Icons.jsx";
import { nextEkadashis, nextFestival, todayInIndia } from "../../utils/panchang.js";

// { y, m, d } -> "गुरुवार, 5 नवंबर 2026"
const hiDate = ({ y, m, d }) =>
  new Date(y, m - 1, d).toLocaleDateString("hi-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

const daysLeft = (n) => (n === 0 ? "आज" : n === 1 ? "कल" : `${n} दिन शेष`);

// Next ekadashis with their names
export function EkadashiCard({ data }) {
  const list = useMemo(() => nextEkadashis(todayInIndia(), data.count || 4), [data.count]);

  return (
    <>
      <span className="darshan-card__icon">
        <Icon name="heart" size={22} />
      </span>
      <h3 className="darshan-card__title">{data.title}</h3>
      <ul className="fest-list">
        {list.map((e, i) => (
          <li key={`${e.y}-${e.m}-${e.d}`} className={i === 0 ? "is-next" : ""}>
            <span className="fest-list__day">
              <strong>{e.d}</strong>
              {new Date(e.y, e.m - 1, e.d).toLocaleDateString("hi-IN", { month: "short" })}
            </span>
            <span className="fest-list__body">
              <strong>{e.name} एकादशी</strong>
              <small>
                {e.p.maas} {e.p.paksha} · {hiDate(e).split(",")[0]}
              </small>
            </span>
            <em className="fest-list__left">{daysLeft(e.offset)}</em>
          </li>
        ))}
      </ul>
    </>
  );
}

// Main utsavs of the dham, nearest first. Tithi-based ones get their next date from the panchang;
// the rest have a fixed month (`approx`) and a `when` label.
export function MahotsavCard({ data }) {
  const list = useMemo(() => {
    const today = todayInIndia();
    const base = new Date(today.y, today.m - 1, today.d);
    return data.items
      .map((it) => {
        if (it.tithi) {
          const at = nextFestival(today, it);
          return at && { ...it, at, sort: at.offset };
        }
        // fixed month: this year's date, or next year's once it has passed
        let t = new Date(today.y, it.approx.m - 1, it.approx.d);
        if (t < base) t = new Date(today.y + 1, it.approx.m - 1, it.approx.d);
        return { ...it, sort: Math.round((t - base) / 86400000) };
      })
      .filter(Boolean)
      .sort((a, b) => a.sort - b.sort)
      .slice(0, data.count || 5);
  }, [data]);

  return (
    <>
      <span className="darshan-card__icon">
        <Icon name="star" size={22} />
      </span>
      <h3 className="darshan-card__title">{data.title}</h3>
      <ul className="fest-list">
        {list.map((f, i) => (
          <li key={f.name} className={i === 0 ? "is-next" : ""}>
            <span className="fest-list__day">
              {f.at ? (
                <>
                  <strong>{f.at.d}</strong>
                  {new Date(f.at.y, f.at.m - 1, f.at.d).toLocaleDateString("hi-IN", { month: "short" })}
                </>
              ) : (
                <strong className="fest-list__month">{f.when}</strong>
              )}
            </span>
            <span className="fest-list__body">
              <strong>{f.name}</strong>
              <small>{f.text}</small>
            </span>
            {f.at && <em className="fest-list__left">{daysLeft(f.at.offset)}</em>}
          </li>
        ))}
      </ul>
    </>
  );
}
