import { useEffect, useState } from "react";
import useReveal from "../../hooks/useReveal.js";
import Icon, { LotusLogo } from "../ui/Icons.jsx";
import "./Counters.css";

// Counts from 0 up to `value` once `start` becomes true
function useCountUp(value, start, duration = 1800) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let frame;
    const begin = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - begin) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    // Fallback: animation frames can be paused (background tab), so make sure
    // the final number is always shown.
    const done = setTimeout(() => setCount(value), duration + 200);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(done);
    };
  }, [value, start, duration]);

  return count;
}

function Counter({ stat, start }) {
  const count = useCountUp(stat.value, start);
  return (
    <div className="counter">
      <span className="counter__icon">
        {stat.icon === "lotus" ? <LotusLogo size={40} /> : <Icon name={stat.icon} size={36} />}
      </span>
      <div className="counter__value">
        {count.toLocaleString("en-IN")}
        {stat.suffix}
      </div>
      <div className="counter__label">{stat.label}</div>
    </div>
  );
}

export default function Counters({ stats }) {
  const [ref, visible] = useReveal(0.3);

  return (
    <section className="counters" ref={ref}>
      <div className="container counters__grid">
        {stats.map((stat) => (
          <Counter key={stat.label} stat={stat} start={visible} />
        ))}
      </div>
    </section>
  );
}
