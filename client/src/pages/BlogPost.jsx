import { Link, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch.js";
import { api } from "../services/api.js";
import Loader from "../components/ui/Loader.jsx";
import PageTitle from "../components/ui/PageTitle.jsx";
import Icon from "../components/ui/Icons.jsx";
import { CATEGORY_LABELS } from "../components/blog/PostRow.jsx";
import { longDate } from "../utils/eventDates.js";
import "./EventDetail.css";
import "./BlogPost.css";

export default function BlogPost() {
  const { slug } = useParams();
  const { data: post, loading, error } = useFetch(() => api.getPost(slug), [slug]);

  if (loading) return <Loader />;
  if (error || !post) {
    return (
      <>
        <PageTitle title="Post not found" crumbs={[{ label: "Blog", path: "/blog" }, { label: "Not found" }]} />
        <section className="section">
          <div className="container">
            <p className="events-empty">
              This post does not exist or has been removed. <Link to="/blog">See all posts</Link>
            </p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageTitle
        title={post.title}
        image={post.image}
        imagePosition="center 30%"
        crumbs={[{ label: "Blog", path: "/blog" }, { label: post.title }]}
      />

      <section className="section blog-post">
        <div className="container blog-post__container">
          <Link to="/blog" className="event-detail__back">
            <Icon name="chevronLeft" size={16} /> All Posts
          </Link>

          <div className="blog-post__meta">
            <time dateTime={post.date}>{longDate(post.date)}</time>
            <Link to={`/blog?category=${post.category}`} className="blog-post__category">
              {CATEGORY_LABELS[post.category] || post.category}
            </Link>
            <span>
              Posted by <strong>{post.author}</strong>
            </span>
          </div>

          <h2 className="blog-post__title">{post.title}</h2>

          {post.image && <img src={post.image} alt="" className="blog-post__image" />}

          <div className="blog-post__content">
            {/* content items are paragraphs, or { image } / { heading } / { youtube, title } */}
            {post.content?.map((item, i) => <ContentItem key={i} item={item} />) ?? <p>{post.excerpt}</p>}
          </div>

          {post.tags?.length > 0 && (
            <div className="blog-post__tags">
              {post.tags.map((tag) => (
                <Link key={tag} to={`/blog?search=${encodeURIComponent(tag)}`}>
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {/* Newer / older post */}
          <nav className="blog-post__nav" aria-label="More posts">
            {post.newer ? (
              <Link to={`/blog/${post.newer.slug}`} className="blog-post__nav-link">
                <span className="blog-post__nav-label">
                  <Icon name="chevronLeft" size={14} /> Newer post
                </span>
                {post.newer.title}
              </Link>
            ) : (
              <span />
            )}
            {post.older && (
              <Link to={`/blog/${post.older.slug}`} className="blog-post__nav-link blog-post__nav-link--older">
                <span className="blog-post__nav-label">
                  Older post <Icon name="chevronRight" size={14} />
                </span>
                {post.older.title}
              </Link>
            )}
          </nav>
        </div>
      </section>
    </>
  );
}

function ContentItem({ item }) {
  if (typeof item === "string") return <p>{item}</p>;
  if (item.heading) return <h3 className="blog-post__heading">{item.heading}</h3>;
  if (item.youtube) {
    return (
      <div className="blog-post__video">
        <iframe
          src={`https://www.youtube.com/embed/${item.youtube}`}
          title={item.title || "YouTube video"}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  return <img src={item.image} alt="" className="blog-post__inline-image" loading="lazy" />;
}
