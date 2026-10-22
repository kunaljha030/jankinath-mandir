import "./Loader.css";

// While a page loads: an empty white space (no preloader). Shows a message when `error` is set.
export default function Loader({ error }) {
  if (!error) return <div className="loader loader--blank" aria-busy="true" />;
  return (
    <div className="loader">
      <p className="loader__error">{error}</p>
    </div>
  );
}
