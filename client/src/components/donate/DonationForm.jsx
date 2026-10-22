import { useState } from "react";
import { api } from "../../services/api.js";
import { formatINR } from "../../utils/money.js";
import Button from "../ui/Button.jsx";
import "./DonationForm.css";

const empty = { name: "", email: "", phone: "", message: "", anonymous: false, website: "" };

/**
 * Amount buttons + custom amount, donor details, then a thank-you screen with
 * the UPI / bank details (offline donation — no online payment gateway yet).
 */
export default function DonationForm({ cause }) {
  const [amount, setAmount] = useState(cause.presetAmounts[1] || 1100);
  const [custom, setCustom] = useState("");
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [sending, setSending] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const finalAmount = custom !== "" ? Number(custom) : amount;

  const update = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!finalAmount || finalAmount < 1) {
      setStatus({ type: "error", message: "Please choose or enter an amount." });
      return;
    }
    setSending(true);
    setStatus({ type: "", message: "" });
    try {
      const res = await api.donate(cause.slug, { ...form, amount: finalAmount });
      setReceipt(res);
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setSending(false);
    }
  };

  if (receipt) {
    const { payment } = receipt;
    return (
      <div className="donation-form donation-form--done" role="status">
        <h4>Thank you, {form.name.split(" ")[0]}!</h4>
        <p>
          Your seva of <strong>{formatINR(receipt.amount)}</strong> for <strong>{receipt.cause}</strong> has been
          recorded. Please complete the payment using the details below and mention your reference number.
        </p>

        <div className="donation-form__ref">
          Reference no. <strong>{receipt.reference}</strong>
        </div>

        <dl className="donation-form__pay">
          <dt>UPI ID</dt>
          <dd>{payment.upiId}</dd>
          <dt>Account name</dt>
          <dd>{payment.bank.accountName}</dd>
          <dt>Account no.</dt>
          <dd>{payment.bank.accountNumber}</dd>
          <dt>IFSC</dt>
          <dd>{payment.bank.ifsc}</dd>
          <dt>Bank</dt>
          <dd>{payment.bank.bankName}</dd>
        </dl>

        <p className="donation-form__small">You can also give your seva at the mandir office. Jai Siya Ram!</p>
        <Button
          variant="outline"
          size="small"
          onClick={() => {
            setReceipt(null);
            setForm(empty);
            setCustom("");
          }}
        >
          Make another donation
        </Button>
      </div>
    );
  }

  return (
    <form className="donation-form" onSubmit={handleSubmit} noValidate>
      <h4>Select an amount</h4>

      <div className="donation-form__amounts">
        {cause.presetAmounts.map((a) => (
          <button
            type="button"
            key={a}
            className={`donation-form__amount ${custom === "" && amount === a ? "is-active" : ""}`}
            onClick={() => {
              setAmount(a);
              setCustom("");
            }}
          >
            {formatINR(a)}
          </button>
        ))}
      </div>

      <label className="donation-form__custom">
        <span>₹</span>
        <input
          type="number"
          min="1"
          step="1"
          inputMode="numeric"
          placeholder="Other amount"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          aria-label="Custom amount in rupees"
        />
      </label>

      <h4>Your details</h4>
      <div className="donation-form__fields">
        <input name="name" placeholder="Full name *" value={form.name} onChange={update} required autoComplete="name" />
        <input
          name="email"
          type="email"
          placeholder="Email *"
          value={form.email}
          onChange={update}
          required
          autoComplete="email"
        />
        <input name="phone" type="tel" placeholder="Phone (optional)" value={form.phone} onChange={update} autoComplete="tel" />
        <textarea
          name="message"
          rows="3"
          placeholder="Message / name for the seva (optional)"
          value={form.message}
          onChange={update}
        />
        {/* Honeypot: hidden from people */}
        <input
          name="website"
          value={form.website}
          onChange={update}
          className="visually-hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
      </div>

      <label className="donation-form__check">
        <input type="checkbox" name="anonymous" checked={form.anonymous} onChange={update} />
        Keep my donation anonymous
      </label>

      {status.message && <p className="donation-form__error">{status.message}</p>}

      <Button type="submit" disabled={sending} className="donation-form__submit">
        {sending ? "Please wait..." : `Donate ${finalAmount > 0 ? formatINR(finalAmount) : ""}`}
      </Button>
      <p className="donation-form__small">
        After submitting you will see the UPI / bank details to complete your seva.
      </p>
    </form>
  );
}
