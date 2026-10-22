import Button from "../components/ui/Button.jsx";
import "./NotFound.css";

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="container">
        <h1>404</h1>
        <h3>This page is not built yet</h3>
        <p>We're still working on this part of the site.</p>
        <Button to="/">Back to home</Button>
      </div>
    </section>
  );
}
