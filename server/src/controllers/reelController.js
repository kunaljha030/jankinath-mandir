import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readData } from "../utils/jsonStore.js";

// Reels come from two places, newest first:
// - video files dropped into client/public/videos/reels/ (play automatically on the site)
// - Instagram reel links in data/reels.json (shown with Instagram's embed, which can't autoplay)
const reelsDir =
  process.env.REELS_DIR ||
  path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "client", "public", "videos", "reels");

const VIDEO_EXT = /\.(mp4|webm|mov|m4v)$/i;

// Newest first. On Vercel (file dates are the clone time) or without the folder, the list comes
// from data/media.json (npm run media).
async function readFolderFiles() {
  if (process.env.VERCEL) return (await readData("media")).reels || [];
  let files;
  try {
    files = (await readdir(reelsDir)).filter((f) => VIDEO_EXT.test(f));
  } catch (err) {
    if (err.code === "ENOENT") return (await readData("media")).reels || [];
    throw err;
  }

  const withTime = await Promise.all(
    files.map(async (file) => ({ file, time: (await stat(path.join(reelsDir, file))).mtimeMs }))
  );
  return withTime.sort((a, b) => b.time - a.time).map(({ file }) => file);
}

async function readFolderReels() {
  return (await readFolderFiles()).map((file) => ({
    type: "file",
    id: `reels/${file}`,
    src: `/videos/reels/${encodeURIComponent(file)}`,
  }));
}

export async function getReels(req, res, next) {
  try {
    const [files, links] = await Promise.all([readFolderReels(), readData("reels")]);
    const reels = [...files, ...links.map((url) => ({ type: "instagram", id: url, url }))];
    const limit = Number(req.query.limit) || reels.length;
    res.json(reels.slice(0, limit));
  } catch (err) {
    next(err);
  }
}
