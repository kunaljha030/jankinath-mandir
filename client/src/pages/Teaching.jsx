import useFetch from "../hooks/useFetch.js";
import { api } from "../services/api.js";
import Loader from "../components/ui/Loader.jsx";
import PageTitle from "../components/ui/PageTitle.jsx";
import Welcome from "../components/teaching/Welcome.jsx";
import TopicTiles from "../components/teaching/TopicTiles.jsx";
import TeachingVideos from "../components/teaching/TeachingVideos.jsx";
import LatestPhotos from "../components/home/LatestPhotos.jsx";

export default function Teaching() {
  const { data, loading, error } = useFetch(api.getTeaching);

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
      <Welcome data={data.welcome} />
      <TopicTiles items={data.topics} />
      <TeachingVideos title={data.videos.title} items={data.videos.items} />
      <LatestPhotos title={data.photosTitle} />
    </>
  );
}
