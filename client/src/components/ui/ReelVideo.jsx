import { useRef, useState } from "react";
import Icon from "./Icons.jsx";

// Self-hosted reel: shows a still frame with a play button; plays with sound on click.
// Starting one reel pauses any other reel on the page.
export default function ReelVideo({ src }) {
  const videoRef = useRef(null);
  const [started, setStarted] = useState(false);

  const play = () => {
    setStarted(true);
    videoRef.current?.play();
  };

  const pauseOthers = () => {
    document.querySelectorAll(".reel-video video").forEach((v) => {
      if (v !== videoRef.current) v.pause();
    });
  };

  return (
    <div className="reel-video">
      <div className="reel-video__frame">
        {/* "#t=0.5" makes the browser show a frame from the video as the cover */}
        <video
          ref={videoRef}
          src={`${src}#t=0.5`}
          preload="metadata"
          playsInline
          controls={started}
          onPlay={pauseOthers}
          onEnded={() => setStarted(false)}
        />
        {!started && (
          <button type="button" className="reel-video__play" onClick={play} aria-label="Play video">
            <Icon name="play" size={30} />
          </button>
        )}
      </div>
    </div>
  );
}
