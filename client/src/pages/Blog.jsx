import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../services/api.js";
import PageTitle from "../components/ui/PageTitle.jsx";
import EventsBar from "../components/events/EventsBar.jsx";
import EventsNav from "../components/events/EventsNav.jsx";
import PostRow from "../components/blog/PostRow.jsx";
import { monthLabel } from "../utils/eventDates.js";
import "./Events.css";

const PAGE_SIZE = 6;
const CATEGORIES = [
  { id: "all", label: "All", icon: "list" },
  { id: "articles", label: "Articles", icon: "day" },
  { id: "news", label: "News", icon: "calendar" },
];

/**
 * All Posts — same layout as the Events List: search + tabs, posts grouped by month,
 * Newer / Older navigation. State lives in the URL: /blog?category=news&search=path&page=2
 */
export default function Blog() {
  const [params, setParams] = useSearchParams();
  const category = ["articles", "news"].includes(params.get("category")) ? params.get("category") : "all";
  const search = params.get("search") || "";
  const page = Math.max(1, Number(params.get("page")) || 1);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .getPosts({ category: category === "all" ? "" : category, search })
      .then((data) => active && (setPosts(data), setError(null)))
      .catch((err) => active && setError(err))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [category, search]);

  const update = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([k, v]) => (v && v !== "all" ? next.set(k, v) : next.delete(k)));
    if (next.get("page") === "1") next.delete("page");
    setParams(next);
    window.scrollTo({ top: 0 });
  };

  const pages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const shown = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Group under month headings ("October 2026")
  const groups = [];
  for (const post of shown) {
    const key = post.date.slice(0, 7);
    if (!groups.length || groups[groups.length - 1].key !== key) groups.push({ key, posts: [] });
    groups[groups.length - 1].posts.push(post);
  }

  return (
    <>
      <PageTitle
        title="All Posts"
        image="/images/sant-samagam-4.jpg"
        imagePosition="center 30%"
        crumbs={[{ label: "Blog" }]}
      />

      <section className="section events-page">
        <div className="container">
          <EventsBar
            search={search}
            view={category}
            views={CATEGORIES}
            placeholder="Search posts"
            buttonLabel="Find Posts"
            tabsLabel="Post categories"
            onSearch={(q) => update({ search: q, page: null })}
            onView={(c) => update({ category: c, page: null })}
          />

          {search && (
            <p className="events-search-note">
              Showing results for <strong>“{search}”</strong>{" "}
              <button onClick={() => update({ search: null, page: null })}>Clear search</button>
            </p>
          )}

          <div className={`events-body ${loading ? "is-loading" : ""}`}>
            {error ? (
              <p className="events-empty">Could not load posts. Is the API server running?</p>
            ) : !loading && !shown.length ? (
              <p className="events-empty">No posts found.</p>
            ) : (
              groups.map((g) => (
                <section key={g.key}>
                  <h3 className="events-separator">{monthLabel(`${g.key}-01`)}</h3>
                  <ul className="events-list">
                    {g.posts.map((post) => (
                      <PostRow key={post.id} post={post} />
                    ))}
                  </ul>
                </section>
              ))
            )}
          </div>

          <EventsNav
            prevLabel="Newer Posts"
            nextLabel="Older Posts"
            onPrev={() => update({ page: String(page - 1) })}
            onNext={() => update({ page: String(page + 1) })}
            prevDisabled={page <= 1}
            nextDisabled={page >= pages}
          />
        </div>
      </section>
    </>
  );
}
