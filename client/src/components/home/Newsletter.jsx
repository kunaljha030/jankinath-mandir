import { useState } from "react";
import { api } from "../../services/api.js";
import Button from "../ui/Button.jsx";
import Reveal from "../ui/Reveal.jsx";
import "./Newsletter.css";

const initialForm = { email: "", consent: false, website: "" };

export default function Newsletter({ data }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [sending, setSending] = useState(false);

  const update = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.consent) {
      setStatus({ type: "error", message: "Please agree to the data policy." });
      return;
    }
    setSending(true);
    try {
      const res = await api.subscribe(form);
      setStatus({ type: "success", message: res.message });
      setForm(initialForm);
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="newsletter">
      <div className="container">
        <Reveal className="newsletter__box">
          <div className="newsletter__text">
            <h2>{data.title}</h2>
            <p>{data.text}</p>
          </div>

          <form className="newsletter__form" onSubmit={handleSubmit} noValidate>
            <div className="newsletter__row">
              <label htmlFor="nl-email" className="visually-hidden">
                Email address
              </label>
              <input
                id="nl-email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={form.email}
                onChange={update}
                required
              />
              <Button type="submit" disabled={sending}>
                {sending ? "Sending..." : "Subscribe"}
              </Button>
            </div>

            {/* Honeypot: hidden from people, bots fill it in */}
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={update}
              className="visually-hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <label className="newsletter__consent">
              <input type="checkbox" name="consent" checked={form.consent} onChange={update} />
              <span>I agree that my submitted data is being collected and stored.</span>
            </label>

            {status.message && (
              <p className={`newsletter__status newsletter__status--${status.type}`} role="status">
                {status.message}
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
