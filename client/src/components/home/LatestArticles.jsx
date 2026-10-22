import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch.js";
import { api } from "../../services/api.js";
import { splitDate } from "../../utils/formatDate.js";
import Reveal from "../ui/Reveal.jsx";
import Button from "../ui/Button.jsx";
import "./LatestArticles.css";

function PostDate({ date }) {
  const { day, month } = splitDate(date);
  return (
    <span className="post-date">
      <strong>{day}</strong>
      {month}
    </span>
  );
}

// "Latest Articles" (one featured post) next to "News & Events" (short list)
export default function LatestArticles({ articlesTitle, newsTitle }) {
  const { data: featured } = useFetch(() => api.getPosts({ category: "articles", limit: 1 }));
  const { data: news } = useFetch(() => api.getPosts({ category: "news", limit: 2 }));
  const post = featured?.[0];

  return (
    <section className="section section--alt articles">
      <div className="container articles__grid">
        <div>
          <h2 className="articles__heading">{articlesTitle}</h2>
          {post && (
            <Reveal as="article" className="featured-post">
              <Link to={`/blog/${post.slug}`} className="featured-post__image">
                <img src={post.image} alt={post.title} loading="lazy" />
                <PostDate date={post.date} />
              </Link>
              <div className="featured-post__body">
                <h3>
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <div className="post-meta">
                  posted by <span>{post.author}</span>
                </div>
                <p>{post.excerpt}</p>
                <Button to={`/blog/${post.slug}`} size="small">
                  Learn more
                </Button>
              </div>
            </Reveal>
          )}
        </div>

        <div>
          <h3 className="articles__heading articles__heading--small">{newsTitle}</h3>
          <div className="news-list">
            {news?.map((item, i) => (
              <Reveal as="article" key={item.id} className="news-item" delay={i * 120}>
                <Link to={`/blog/${item.slug}`} className="news-item__image">
                  <img src={item.image} alt={item.title} loading="lazy" />
                  <PostDate date={item.date} />
                </Link>
                <h5>
                  <Link to={`/blog/${item.slug}`}>{item.title}</Link>
                </h5>
                <div className="post-meta">
                  posted by <span>{item.author}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
