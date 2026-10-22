import useFetch from "../hooks/useFetch.js";
import { api } from "../services/api.js";
import Loader from "../components/ui/Loader.jsx";
import Hero from "../components/home/Hero.jsx";
import PeethIntro from "../components/home/PeethIntro.jsx";
import QuoteBanner from "../components/home/QuoteBanner.jsx";
import FeatureCards from "../components/home/FeatureCards.jsx";
import VisionSection from "../components/home/VisionSection.jsx";
import DarshanInfo from "../components/home/DarshanInfo.jsx";
import GauSeva from "../components/home/GauSeva.jsx";
import LatestPhotos from "../components/home/LatestPhotos.jsx";
import LatestArticles from "../components/home/LatestArticles.jsx";
import ConnectSection from "../components/ui/ConnectSection.jsx";

export default function Home() {
  const { data, loading, error } = useFetch(api.getHome);

  if (loading) return <Loader />;
  if (error) return <Loader error="Could not load the page. Is the API server running?" />;

  return (
    <>
      <Hero data={data.hero} />
      <PeethIntro data={data.peeth} />
      <QuoteBanner data={data.quoteBanner} />
      <FeatureCards items={data.features} />
      <VisionSection data={data.vision} />
      <DarshanInfo data={data.darshan} />
      <GauSeva data={data.gauSeva} />
      <ConnectSection flushTop />
      <LatestPhotos title={data.sections.photos} />
      <LatestArticles articlesTitle={data.sections.articles} newsTitle={data.sections.news} />
    </>
  );
}
