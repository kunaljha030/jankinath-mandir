import useFetch from "../hooks/useFetch.js";
import { api } from "../services/api.js";
import Loader from "../components/ui/Loader.jsx";
import PageTitle from "../components/ui/PageTitle.jsx";
import CauseCard from "../components/donate/CauseCard.jsx";
import "../components/donate/Donate.css";

export default function Donate() {
  const { data, loading, error } = useFetch(api.getCauses);

  if (loading) return <Loader />;
  if (error) return <Loader error="Could not load the page. Is the API server running?" />;

  return (
    <>
      <PageTitle
        title="सेवा एवं दान"
        image="/images/gallery/653953168_18003228023854933_1907266496801356844_n.jpg"
        imagePosition="center 30%"
        crumbs={[{ label: "सेवा एवं दान" }]}
      />
      <section className="section">
        <div className="container causes-grid">
          {data.causes.map((cause, i) => (
            <CauseCard key={cause.slug} cause={cause} delay={(i % 2) * 120} />
          ))}
        </div>
      </section>
    </>
  );
}
