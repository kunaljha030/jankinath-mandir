import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readData } from "../utils/jsonStore.js";

// Photos dropped into this folder appear in the gallery automatically, newest first.
// It is served by the client as /images/gallery/<file>.
const galleryDir =
  process.env.GALLERY_DIR ||
  path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "client", "public", "images", "gallery");

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif)$/i;

// Newest first. Without the folder (on Vercel) the list comes from data/media.json (npm run media).
async function readFolderFiles() {
  let files;
  try {
    files = (await readdir(galleryDir)).filter((f) => IMAGE_EXT.test(f));
  } catch (err) {
    if (err.code === "ENOENT") return (await readData("media")).gallery || [];
    throw err;
  }

  const withTime = await Promise.all(
    files.map(async (file) => ({ file, time: (await stat(path.join(galleryDir, file))).mtimeMs }))
  );
  return withTime.sort((a, b) => b.time - a.time).map(({ file }) => file);
}

async function readFolderPhotos() {
  return (await readFolderFiles()).map((file) => ({
    id: `gallery/${file}`,
    image: `/images/gallery/${encodeURIComponent(file)}`,
    alt: "Rewasa Dham",
  }));
}

export async function getGallery(req, res, next) {
  try {
    const [folderPhotos, curated] = await Promise.all([readFolderPhotos(), readData("gallery")]);
    // Every 3rd photo (starting with the first) is shown large in the mosaic grid
    const photos = [...folderPhotos, ...curated].map((photo, i) => ({
      ...photo,
      size: i % 3 === 0 ? "large" : undefined,
    }));
    const limit = Number(req.query.limit) || photos.length;
    res.json(photos.slice(0, limit));
  } catch (err) {
    next(err);
  }
}
