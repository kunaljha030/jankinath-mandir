const BASE_URL = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}

export const api = {
  getSite: () => request("/site"),
  getHome: () => request("/home"),
  getAbout: () => request("/about"),
  getVisit: () => request("/visit"),
  getTeaching: () => request("/teaching"),
  getProducts: (limit) => request(`/products${limit ? `?limit=${limit}` : ""}`),
  getPosts: (params = {}) => {
    const q = new URLSearchParams(Object.entries(params).filter(([, v]) => v));
    return request(`/posts?${q}`);
  },
  getPost: (slug) => request(`/posts/${slug}`),
  getEvents: (params = {}) => {
    const q = new URLSearchParams(Object.entries(params).filter(([, v]) => v));
    return request(`/events?${q}`);
  },
  getEvent: (slug) => request(`/events/${slug}`),
  eventsIcsUrl: (slug) => `${BASE_URL}/events/${slug ? `${slug}/ics` : "ics"}`,
  getCauses: () => request("/causes"),
  getCause: (slug) => request(`/causes/${slug}`),
  donate: (slug, body) => request(`/causes/${slug}/donate`, { method: "POST", body: JSON.stringify(body) }),
  getReels: () => request("/reels"),
  getYoutube: () => request("/youtube"),
  getGallery: (limit) => request(`/gallery${limit ? `?limit=${limit}` : ""}`),
  subscribe: (body) => request("/newsletter", { method: "POST", body: JSON.stringify(body) }),
};
