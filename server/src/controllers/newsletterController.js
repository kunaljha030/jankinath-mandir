import { readData, writeData } from "../utils/jsonStore.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribe(req, res, next) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const { consent, website } = req.body;

    // "website" is a hidden honeypot field; bots fill it, humans don't.
    if (website) return res.status(400).json({ message: "Invalid request" });
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }
    if (!consent) {
      return res.status(400).json({ message: "Please agree to the data policy." });
    }

    const subscribers = await readData("subscribers");
    if (subscribers.some((s) => s.email === email)) {
      return res.status(409).json({ message: "You are already subscribed." });
    }

    subscribers.push({ email, createdAt: new Date().toISOString() });
    await writeData("subscribers", subscribers);
    res.status(201).json({ message: "Thank you for subscribing!" });
  } catch (err) {
    next(err);
  }
}
