import { useEffect, useRef, useState } from "react";
import useFetch from "../hooks/useFetch.js";
import { api } from "../services/api.js";
import Loader from "../components/ui/Loader.jsx";
import PageTitle from "../components/ui/PageTitle.jsx";
import PhotoGrid from "../components/ui/PhotoGrid.jsx";
import Button from "../components/ui/Button.jsx";
import ConnectSection from "../components/ui/ConnectSection.jsx";
import "./Gallery.css";

// Photos shown at first and added by each "Show more" click
const PAGE_SIZE = 24;

// All gallery photos in the mosaic grid (pattern: large, small, small, …)
export default function Gallery() {
  const { data: photos, loading, error } = useFetch(() => api.getGallery());
  const [visible, setVisible] = useState(PAGE_SIZE);
  const loadedMore = useRef(false);

  // After "Show more", scroll down so the newly added photos come into view
  useEffect(() => {
    if (!loadedMore.current) return;
    loadedMore.current = false;
    window.scrollBy({ top: window.innerHeight * 0.75, behavior: "smooth" });
  }, [visible]);

  const showMore = () => {
    loadedMore.current = true;
    setVisible((v) => v + PAGE_SIZE);
  };

  if (loading) return <Loader />;
  if (error) return <Loader error="Could not load the page. Is the API server running?" />;

  return (
    <>
      <PageTitle
        title="Gallery"
        image="/images/sant-samagam-1.jpg"
        imagePosition="center 30%"
        crumbs={[{ label: "Gallery" }]}
      />
      <section className="section">
        <div className="container">
          <PhotoGrid photos={photos.slice(0, visible)} pattern="repeat" variant="gallery" />
          {visible < photos.length && (
            <div className="text-center gallery__more">
              <Button onClick={showMore}>Show more</Button>
            </div>
          )}
        </div>
      </section>
      <ConnectSection alt />
    </>
  );
}
