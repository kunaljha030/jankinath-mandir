// YouTube channel data without an API key:
// - videos: newest regular uploads (Shorts skipped) from the channel's RSS feed
// - live:   the stream that is on air right now, or null
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || "UCjagZZ0B-eL_T1e9cTG8AgA";
const CHANNEL_URL = process.env.YOUTUBE_CHANNEL_URL || "https://www.youtube.com/@RajendraDasjiMaharaj";
const CACHE_MS = 60 * 1000;
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

let cache = { at: 0, data: null };

async function fetchText(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "en" } });
  if (!res.ok) throw new Error(`YouTube request failed (${res.status})`);
  return res.text();
}

// Returns { videoId, title } if the page (a channel /live page or a watch page) is live right now
async function checkLive(url) {
  const html = await fetchText(url);
  const id = html.match(/<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([\w-]{11})"/)?.[1];
  if (!id || !html.includes('"isLiveNow":true')) return null;
  const title = html.match(/<meta name="title" content="([^"]*)"/)?.[1] || "";
  return { videoId: id, title: decodeEntities(title) };
}

// /live sometimes points at an older stream, so the newest upload is checked too
async function findLiveVideo(latest) {
  const live = await checkLive(`https://www.youtube.com/channel/${CHANNEL_ID}/live`).catch(() => null);
  if (live || !latest?.videoId) return live;
  return checkLive(`https://www.youtube.com/watch?v=${latest.videoId}`).catch(() => null);
}

// The RSS feed is sometimes down (404) for every channel, so the channel's /videos page is the fallback
async function findLatestVideos() {
  const videos = await findLatestVideosRss().catch(() => []);
  return videos.length ? videos : findLatestVideosPage();
}

// /videos lists regular uploads only (no Shorts), newest first
async function findLatestVideosPage() {
  const html = await fetchText(`https://www.youtube.com/channel/${CHANNEL_ID}/videos`);
  return html
    .split('"richItemRenderer":')
    .slice(1)
    .map((chunk) => {
      const title = chunk.match(/"lockupMetadataViewModel":\{"title":\{"content":"((?:[^"\\]|\\.)*)"/)?.[1] || "";
      return { videoId: chunk.match(/"contentId":"([\w-]{11})"/)?.[1], title: JSON.parse(`"${title}"`) };
    })
    .filter((v) => v.videoId);
}

async function findLatestVideosRss() {
  const xml = await fetchText(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`);
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
    .map(([, entry]) => ({
      videoId: entry.match(/<yt:videoId>([^<]+)/)?.[1],
      title: decodeEntities(entry.match(/<title>([^<]*)/)?.[1] || ""),
      isShort: entry.includes("youtube.com/shorts/"),
    }))
    .filter((v) => v.videoId && !v.isShort)
    .map(({ videoId, title }) => ({ videoId, title }));
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export async function getYoutube(req, res, next) {
  try {
    if (!cache.data || Date.now() - cache.at > CACHE_MS) {
      const videos = await findLatestVideos().catch(() => []);
      const live = await findLiveVideo(videos[0]);
      cache = { at: Date.now(), data: { channelUrl: CHANNEL_URL, live, videos } };
    }
    res.json(cache.data);
  } catch (err) {
    // YouTube unreachable: still return the channel link so the page can show it
    res.json({ channelUrl: CHANNEL_URL, live: null, videos: [] });
  }
}
