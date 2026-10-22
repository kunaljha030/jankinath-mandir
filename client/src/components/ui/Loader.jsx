import { LotusLogo } from "./Icons.jsx";
import "./Loader.css";

// Full-screen preloader; shows a message instead of the spinner when `error` is set.
export default function Loader({ error }) {
  return (
    <div className="loader">
      <div className={error ? "" : "loader__icon"}>
        <LotusLogo size={64} />
      </div>
      {error && <p className="loader__error">{error}</p>}
    </div>
  );
}
