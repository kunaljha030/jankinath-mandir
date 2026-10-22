import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Simple JSON-file storage. Swap these two functions for a database later
// (MongoDB, PostgreSQL, ...) without touching controllers.
const dataDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "data");

export async function readData(name) {
  const raw = await readFile(path.join(dataDir, `${name}.json`), "utf-8");
  return JSON.parse(raw);
}

// Hosts like Vercel have a read-only file system: forms then answer with a clear message
// instead of a crash. Connect a database here to save them there.
export async function writeData(name, data) {
  try {
    await writeFile(path.join(dataDir, `${name}.json`), JSON.stringify(data, null, 2));
  } catch (err) {
    if (!["EROFS", "EACCES", "EPERM"].includes(err.code)) throw err;
    const unavailable = new Error(
      "ऑनलाइन फ़ॉर्म अभी उपलब्ध नहीं है। कृपया इस पृष्ठ पर दिए गए विवरण से सेवा करें या मंदिर से सम्पर्क करें।"
    );
    unavailable.status = 503;
    throw unavailable;
  }
}
