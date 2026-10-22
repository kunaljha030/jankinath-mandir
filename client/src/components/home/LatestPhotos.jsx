import useFetch from "../../hooks/useFetch.js";
import { api } from "../../services/api.js";
import SectionTitle from "../ui/SectionTitle.jsx";
import Button from "../ui/Button.jsx";
import PhotoGrid from "../ui/PhotoGrid.jsx";
import "./LatestPhotos.css";

// First 6 gallery photos in the mosaic grid + link to the full Gallery page
export default function LatestPhotos({ title }) {
  const { data: photos } = useFetch(() => api.getGallery(6));

  return (
    <section className="section photos">
      <div className="container">
        <SectionTitle title={title} />
        {photos && <PhotoGrid photos={photos} />}
        <div className="text-center photos__more">
          <Button to="/gallery">View all photos</Button>
        </div>
      </div>
    </section>
  );
}
