import useFetch from "../hooks/useFetch.js";
import { api } from "../services/api.js";
import Loader from "../components/ui/Loader.jsx";
import PageTitle from "../components/ui/PageTitle.jsx";
import QuoteSplit from "../components/visit/QuoteSplit.jsx";
import ServicesFeatured from "../components/about/ServicesFeatured.jsx";
import DailySchedule from "../components/visit/DailySchedule.jsx";
import Protocol from "../components/visit/Protocol.jsx";
import LocationInfo from "../components/visit/LocationInfo.jsx";

export default function Visit() {
  const { data, loading, error } = useFetch(api.getVisit);

  if (loading) return <Loader />;
  if (error) return <Loader error="Could not load the page. Is the API server running?" />;

  return (
    <>
      <PageTitle
        title={data.pageTitle.title}
        image={data.pageTitle.image}
        imagePosition={data.pageTitle.imagePosition}
        crumbs={[{ label: "About", path: "/about" }, { label: data.pageTitle.title }]}
      />
      <LocationInfo data={data.location} />
      <QuoteSplit data={data.quote} />
      <ServicesFeatured title={data.rules.title} items={data.rules.items} lang="hi" />
      <DailySchedule data={data.schedule} />
      <Protocol data={data.protocol} />
    </>
  );
}
