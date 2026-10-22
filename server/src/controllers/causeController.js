import { randomUUID } from "node:crypto";
import { readData, writeData } from "../utils/jsonStore.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d][\d\s-]{7,15}$/;
const MAX_AMOUNT = 10000000;

/*
 * Donations are "offline": the form records the pledge (status "pending") and the
 * donor pays by UPI / bank transfer. When the mandir receives the money it changes
 * the donation's status to "completed" in donations.json — only completed donations
 * count towards a cause's progress bar.
 */
function withTotals(cause, donations) {
  const done = donations.filter((d) => d.causeSlug === cause.slug && d.status === "completed");
  const raised = done.reduce((sum, d) => sum + d.amount, 0);
  return {
    ...cause,
    raised,
    donationCount: done.length,
    percent: cause.goal ? Math.min(100, Math.round((raised / cause.goal) * 100)) : 0,
  };
}

export async function getCauses(req, res, next) {
  try {
    const [{ causes, currency }, donations] = await Promise.all([readData("causes"), readData("donations")]);
    res.json({ currency, causes: causes.map((c) => withTotals(c, donations)) });
  } catch (err) {
    next(err);
  }
}

export async function getCause(req, res, next) {
  try {
    const [{ causes, currency, presetAmounts, payment }, donations] = await Promise.all([
      readData("causes"),
      readData("donations"),
    ]);
    const cause = causes.find((c) => c.slug === req.params.slug);
    if (!cause) return res.status(404).json({ message: "Cause not found" });
    res.json({ ...withTotals(cause, donations), currency, presetAmounts, payment });
  } catch (err) {
    next(err);
  }
}

// POST /api/causes/:slug/donate  { amount, name, email, phone, message, anonymous }
export async function donate(req, res, next) {
  try {
    const { causes, payment } = await readData("causes");
    const cause = causes.find((c) => c.slug === req.params.slug);
    if (!cause) return res.status(404).json({ message: "Cause not found" });

    const amount = Math.round(Number(req.body.amount));
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const phone = String(req.body.phone || "").trim();
    const message = String(req.body.message || "").trim().slice(0, 1000);

    if (req.body.website) return res.status(400).json({ message: "Invalid request" }); // honeypot
    if (!Number.isFinite(amount) || amount < 1 || amount > MAX_AMOUNT) {
      return res.status(400).json({ message: "Please enter a valid amount." });
    }
    if (name.length < 2) return res.status(400).json({ message: "Please enter your name." });
    if (!EMAIL_RE.test(email)) return res.status(400).json({ message: "Please enter a valid email address." });
    if (phone && !PHONE_RE.test(phone)) return res.status(400).json({ message: "Please enter a valid phone number." });

    const donation = {
      id: randomUUID(),
      reference: `JN-${Date.now().toString(36).toUpperCase()}`,
      causeSlug: cause.slug,
      amount,
      name,
      email,
      phone,
      message,
      anonymous: Boolean(req.body.anonymous),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const donations = await readData("donations");
    donations.push(donation);
    await writeData("donations", donations);

    res.status(201).json({
      message: "Thank you! Your donation pledge has been recorded.",
      reference: donation.reference,
      amount,
      cause: cause.title,
      payment,
    });
  } catch (err) {
    next(err);
  }
}
