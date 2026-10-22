import { Link } from "react-router-dom";
import { longDate, weekdayShort } from "../../utils/eventDates.js";
import Reveal from "../ui/Reveal.jsx";
import "../events/EventRow.css";

export const CATEGORY_LABELS = { articles: "Articles", news: "News & Events" };

// One post in the All Posts list — same layout as an event row (date tag | details | photo)
export default function PostRow({ post }) {
  return (
    <Reveal as="li" className="event-row">
      <div className="event-row__date">
        <time dateTime={post.date}>
          <span className="event-row__weekday">{weekdayShort(post.date)}</span>
          <span className="event-row__daynum">{Number(post.date.slice(8, 10))}</span>
        </time>
      </div>

      <article className="event-row__card">
        <div className="event-row__details">
          <div className="event-row__datetime">
            {longDate(post.date)}
            <span className="event-row__badge">{CATEGORY_LABELS[post.category] || post.category}</span>
          </div>
          <h3 className="event-row__title">
            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>
          <div className="event-row__venue">
            <strong>Posted by</strong> {post.author}
          </div>
          <p className="event-row__desc">{post.excerpt}</p>
          <Link to={`/blog/${post.slug}`} className="link-more">
            Read more
          </Link>
        </div>

        {post.image && (
          <Link to={`/blog/${post.slug}`} className="event-row__image" tabIndex={-1} aria-hidden="true">
            <img src={post.image} alt="" loading="lazy" />
          </Link>
        )}
      </article>
    </Reveal>
  );
}
