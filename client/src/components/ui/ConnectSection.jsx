import SectionTitle from "./SectionTitle.jsx";
import ConnectCards from "./ConnectCards.jsx";

// "Connect With Us" section (YouTube / Instagram / WhatsApp), used on Home and Gallery.
// alt: grey background; flushTop: no top padding when it follows another section with the same background
export default function ConnectSection({ alt = false, flushTop = false }) {
  return (
    <section className={`section ${alt ? "section--alt" : ""}`} style={flushTop ? { paddingTop: 0 } : undefined}>
      <div className="container connect-section__container">
        <SectionTitle title="Connect With Us" />
        <ConnectCards />
      </div>
    </section>
  );
}
