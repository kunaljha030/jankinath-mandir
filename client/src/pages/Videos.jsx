import { useState } from "react";
import useFetch from "../hooks/useFetch.js";
import { api } from "../services/api.js";
import Loader from "../components/ui/Loader.jsx";
import PageTitle from "../components/ui/PageTitle.jsx";
import Reveal from "../components/ui/Reveal.jsx";
import VideoModal from "../components/ui/VideoModal.jsx";
import Icon from "../components/ui/Icons.jsx";
import SectionTitle from "../components/ui/SectionTitle.jsx";
import InstagramEmbed from "../components/ui/InstagramEmbed.jsx";
import ReelVideo from "../components/ui/ReelVideo.jsx";
import ConnectSection from "../components/ui/ConnectSection.jsx";
import "./Videos.css";

// Latest YouTube videos from the channel (updates automatically; click to play in a popup),
// then reels: video files from public/videos/reels (play button, plays with sound on click) and Instagram reel links
export default function Videos() {
  const { data, loading, error } = useFetch(() => api.getYoutube());
  const { data: reels } = useFetch(() => api.getReels());
  const [playing, setPlaying] = useState(null);

  if (loading) return <Loader />;
  if (error) return <Loader error="Could not load the page. Is the API server running?" />;

  return (
    <>
      <PageTitle
        title="Videos"
        image="/images/gallery/795027792_18370338208242500_2702529333012273222_n.jpg"
        imagePosition="center 30%"
        crumbs={[{ label: "Gallery", path: "/gallery" }, { label: "Videos" }]}
      />
      <section className="section">
        <div className="container">
          {data.videos.length === 0 ? (
            <p className="text-center">
              Videos could not be loaded right now.{" "}
              <a href={data.channelUrl} target="_blank" rel="noopener noreferrer">
                Watch on YouTube
              </a>
            </p>
          ) : (
            <Reveal className="videos-grid">
              {data.videos.map((v) => (
                <button
                  key={v.videoId}
                  className="video-card"
                  onClick={() => setPlaying(`https://www.youtube.com/embed/${v.videoId}`)}
                >
                  <span className="video-card__thumb">
                    <img src={`https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`} alt="" loading="lazy" />
                    <span className="video-card__play" aria-hidden="true">
                      <Icon name="play" size={28} />
                    </span>
                  </span>
                  <span className="video-card__title">{v.title}</span>
                </button>
              ))}
            </Reveal>
          )}
          <div className="text-center videos__more">
            <a className="btn btn--primary" href={data.channelUrl} target="_blank" rel="noopener noreferrer">
              More videos on YouTube
            </a>
          </div>
        </div>
      </section>
      {reels?.length > 0 && (
        <section className="section section--alt reels-section">
          <div className="container">
            <SectionTitle title="Instagram Reels" />
            <div className="reels-grid">
              {reels.map((reel) =>
                reel.type === "file" ? (
                  <ReelVideo key={reel.id} src={reel.src} />
                ) : (
                  <InstagramEmbed key={reel.id} url={reel.url} />
                )
              )}
            </div>
            <div className="text-center videos__more">
              <a
                className="btn btn--primary"
                href="https://www.instagram.com/rajendradasjimaharaj/reels/"
                target="_blank"
                rel="noopener noreferrer"
              >
                More reels on Instagram
              </a>
            </div>
          </div>
        </section>
      )}
      <ConnectSection alt={!reels?.length} />
      <VideoModal url={playing} onClose={() => setPlaying(null)} />
    </>
  );
}
