import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readData } from "../utils/jsonStore.js";

// Thakur Ji photos dropped into this folder become the homepage hero slides (sorted by file name).
const heroDir =
  process.env.HERO_DIR ||
  path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "client", "public", "images", "hero");

// Without the folder (on Vercel) the list comes from data/media.json (npm run media)
async function readHeroSlides() {
  let files;
  try {
    files = (await readdir(heroDir)).filter((f) => /.(jpe?g|png|webp|avif)$/i.test(f)).sort();
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
    files = (await readData("media")).hero || [];
  }
  return files.map((f) => `/images/hero/${encodeURIComponent(f)}`);
}

export async function getSite(req, res, next) {
  try {
    res.json(await readData("site"));
  } catch (err) {
    next(err);
  }
}

// The daily schedule is shared by the About and Visit pages (one file: schedule.json)
export async function getAbout(req, res, next) {
  try {
    const [about, schedule] = await Promise.all([readData("about"), readData("schedule")]);
    res.json({ ...about, schedule });
  } catch (err) {
    next(err);
  }
}

export async function getVisit(req, res, next) {
  try {
    const [visit, schedule] = await Promise.all([readData("visit"), readData("schedule")]);
    res.json({ ...visit, schedule });
  } catch (err) {
    next(err);
  }
}

export async function getHome(req, res, next) {
  try {
    const [home, slides] = await Promise.all([readData("home"), readHeroSlides()]);
    // Fall back to the single hero image when the folder is empty
    home.hero.slides = slides.length ? slides : [home.hero.image];
    res.json(home);
  } catch (err) {
    next(err);
  }
}

export async function getTeaching(req, res, next) {
  try {
    res.json(await readData("teaching"));
  } catch (err) {
    next(err);
  }
}
