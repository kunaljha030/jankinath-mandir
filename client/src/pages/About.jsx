import useFetch from "../hooks/useFetch.js";
import { api } from "../services/api.js";
import Loader from "../components/ui/Loader.jsx";
import PageTitle from "../components/ui/PageTitle.jsx";
import HistoryTabs from "../components/about/HistoryTabs.jsx";
import Significance from "../components/about/Significance.jsx";
import Lineage from "../components/about/Lineage.jsx";
import ServicesFeatured from "../components/about/ServicesFeatured.jsx";
import TeamSlider from "../components/about/TeamSlider.jsx";
import DailySchedule from "../components/visit/DailySchedule.jsx";
import LatestPhotos from "../components/home/LatestPhotos.jsx";
import NaamJap from "../components/home/NaamJap.jsx";

export default function About() {
  const { data, loading, error } = useFetch(api.getAbout);

  if (loading) return <Loader />;
  if (error) return <Loader error="Could not load the page. Is the API server running?" />;

  return (
    <>
      <PageTitle
        title={data.pageTitle.title}
        image={data.pageTitle.image}
        imagePosition={data.pageTitle.imagePosition}
        crumbs={[{ label: data.pageTitle.title }]}
      />
      <HistoryTabs data={data.history} />
      <Significance data={data.significance} />
      <TeamSlider title={data.team.title} subtitle={data.team.subtitle} members={data.team.members} />
      <Lineage data={data.lineage} />
      <ServicesFeatured items={data.services} slider lang="hi" />
      <NaamJap data={data.naamJap} />
      <DailySchedule data={data.schedule} />
      <LatestPhotos title="Latest Photos" />
    </>
  );
}
