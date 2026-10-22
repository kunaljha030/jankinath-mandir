// Writes server/src/data/media.json: the photos and reels found in client/public.
// The API lists those folders directly when it can see them (local dev); on Vercel the API
// runs as a serverless function without client/public, so it reads this file instead.
// Run locally (npm run media, also done by npm run dev) and commit the result: on Vercel the
// files' dates are the clone time, so the "newest first" order must come from here.
import { readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const pub = path.join(root, "client", "public");
const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif)$/i;
const VIDEO_EXT = /\.(mp4|webm|mov|m4v)$/i;

async function list(dir, ext) {
  try {
    return (await readdir(path.join(pub, dir))).filter((f) => ext.test(f));
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

// newest first, like the controllers
async function byTime(dir, files) {
  const withTime = await Promise.all(files.map(async (f) => ({ f, t: (await stat(path.join(pub, dir, f))).mtimeMs })));
  return withTime.sort((a, b) => b.t - a.t).map(({ f }) => f);
}

const media = {
  hero: (await list("images/hero", IMAGE_EXT)).sort(),
  gallery: await byTime("images/gallery", await list("images/gallery", IMAGE_EXT)),
  reels: await byTime("videos/reels", await list("videos/reels", VIDEO_EXT)),
};

await writeFile(path.join(root, "server", "src", "data", "media.json"), JSON.stringify(media, null, 2) + "\n");
console.log(`media.json: ${media.hero.length} hero, ${media.gallery.length} gallery, ${media.reels.length} reels`);
