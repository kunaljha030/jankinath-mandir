import { Link } from "react-router-dom";
import Button from "../ui/Button.jsx";
import Icon, { LotusLogo } from "../ui/Icons.jsx";

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <Link to={`/shop/${product.slug}`} className="product-card__image">
        {product.image ? (
          <img src={product.image} alt={product.title} loading="lazy" />
        ) : (
          // No photo yet: draw a simple book cover with the title
          <span className="product-card__cover">
            <LotusLogo size={46} color="#fff" />
            <span className="product-card__cover-title">{product.title}</span>
          </span>
        )}
      </Link>
      <div className="product-card__body">
        <div className="product-card__tags">
          {product.tags.map((tag) => (
            <Link key={tag} to={`/shop?tag=${tag}`}>
              {tag}
            </Link>
          ))}
        </div>
        <h5 className="product-card__title">
          <Link to={`/shop/${product.slug}`}>{product.title}</Link>
        </h5>
        {product.rating > 0 && (
          <div className="product-card__rating" aria-label={`Rated ${product.rating} out of 5`}>
            {Array.from({ length: 5 }, (_, i) => (
              <Icon key={i} name="star" size={14} className={i < product.rating ? "is-filled" : ""} />
            ))}
          </div>
        )}
        <div className="product-card__price">${product.price.toFixed(2)}</div>
        <Button size="small" variant="outline">
          Buy now
        </Button>
      </div>
    </article>
  );
}
