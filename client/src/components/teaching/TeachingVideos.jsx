import SectionTitle from "../ui/SectionTitle.jsx";
import Reveal from "../ui/Reveal.jsx";
import Icon from "../ui/Icons.jsx";
import VideoBox from "./VideoBox.jsx";
import "./TeachingVideos.css";

// "धार्मिक शिक्षा" grid of short videos (files in client/public/videos/teaching/).
// `src` can be a video file or a YouTube embed link; an empty `src` shows a placeholder box.
export default function TeachingVideos({ title, items }) {
  if (!items?.length) return null;

  return (
    <section className="section teaching-videos">
      <div className="container">
        <SectionTitle title={title} />
        <div className="teaching-videos__grid">
          {items.map((item, i) => (
            <Reveal key={i} className="teaching-videos__item" delay={(i % 3) * 80}>
              {item.src.includes("youtube.com/embed") ? (
                <iframe src={item.src} title={`${title} ${i + 1}`} allow="encrypted-media; picture-in-picture" allowFullScreen loading="lazy" />
              ) : item.src ? (
                <VideoBox src={item.src} poster={item.poster} title={`${title} ${i + 1}`} />
              ) : (
                <div className="teaching-videos__placeholder">
                  <Icon name="play" size={34} />
                  <span>वीडियो जल्द आ रहा है</span>
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
