import { readData } from "../utils/jsonStore.js";

// Newest first
async function loadPosts() {
  const posts = await readData("posts");
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * GET /api/posts
 *   ?category=news|articles   ?search=text   ?limit=3
 */
export async function getPosts(req, res, next) {
  try {
    let posts = await loadPosts();
    const { category, search } = req.query;

    if (category) posts = posts.filter((p) => p.category === category);
    if (search) {
      const q = search.toLowerCase();
      posts = posts.filter((p) =>
        [p.title, p.excerpt, ...(p.tags || [])].some((f) => f?.toLowerCase().includes(q))
      );
    }
    const limit = Number(req.query.limit) || posts.length;
    res.json(posts.slice(0, limit));
  } catch (err) {
    next(err);
  }
}

// GET /api/posts/:slug — the post plus its newer / older neighbours
export async function getPostBySlug(req, res, next) {
  try {
    const posts = await loadPosts();
    const i = posts.findIndex((p) => p.slug === req.params.slug);
    if (i === -1) return res.status(404).json({ message: "Post not found" });

    const brief = (p) => p && { slug: p.slug, title: p.title, image: p.image, date: p.date };
    res.json({ ...posts[i], newer: brief(posts[i - 1]), older: brief(posts[i + 1]) });
  } catch (err) {
    next(err);
  }
}
