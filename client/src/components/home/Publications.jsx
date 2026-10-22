import useFetch from "../../hooks/useFetch.js";
import { api } from "../../services/api.js";
import SectionTitle from "../ui/SectionTitle.jsx";
import ProductCard from "./ProductCard.jsx";
import Reveal from "../ui/Reveal.jsx";
import "./Publications.css";

export default function Publications({ title }) {
  const { data: products, loading, error } = useFetch(() => api.getProducts(4));

  return (
    <section className="section section--alt publications">
      <div className="container">
        <SectionTitle title={title} />
        {error && <p className="text-center">Could not load products.</p>}
        {!loading && products && (
          <div className="publications__grid">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={i * 120}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
