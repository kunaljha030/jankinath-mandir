import { Link, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch.js";
import { api } from "../services/api.js";
import Loader from "../components/ui/Loader.jsx";
import PageTitle from "../components/ui/PageTitle.jsx";
import Icon from "../components/ui/Icons.jsx";
import DonationProgress from "../components/donate/DonationProgress.jsx";
import DonationForm from "../components/donate/DonationForm.jsx";
import "../components/donate/Donate.css";
import "./DonateCause.css";

export default function DonateCause() {
  const { slug } = useParams();
  const { data: cause, loading, error } = useFetch(() => api.getCause(slug), [slug]);

  if (loading) return <Loader />;
  if (error || !cause) {
    return (
      <>
        <PageTitle title="Cause not found" crumbs={[{ label: "सेवा एवं दान", path: "/donate" }, { label: "Not found" }]} />
        <section className="section">
          <div className="container">
            <p className="events-empty">
              This donation cause does not exist. <Link to="/donate">See all causes</Link>
            </p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageTitle
        title={cause.title}
        image="/images/temple-darbar-2.jpg"
        imagePosition="center 30%"
        crumbs={[{ label: "सेवा एवं दान", path: "/donate" }, { label: cause.title }]}
      />

      <section className="section donate-cause">
        <div className="container">
          <Link to="/donate" className="event-detail__back">
            <Icon name="chevronLeft" size={16} /> All Causes
          </Link>

          <div className="donate-cause__grid">
            <div>
              <img src={cause.image} alt="" className="donate-cause__image" />
              <h2 className="donate-cause__title">{cause.title}</h2>
              <DonationProgress {...cause} />
              <p className="donate-cause__desc">{cause.description}</p>
            </div>

            <aside className="donate-cause__form">
              <DonationForm cause={cause} />
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
