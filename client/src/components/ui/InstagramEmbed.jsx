import { useEffect } from "react";
import "./InstagramEmbed.css";

const SCRIPT_SRC = "https://www.instagram.com/embed.js";

// Official Instagram embed for a public post (carousels show every slide).
// The script is loaded once; on later mounts we ask it to re-scan the page.
export default function InstagramEmbed({ url }) {
  useEffect(() => {
    if (window.instgrm) {
      window.instgrm.Embeds.process();
      return;
    }
    if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      document.body.appendChild(script);
    }
  }, [url]);

  return (
    <div className="instagram-embed">
      <blockquote className="instagram-media" data-instgrm-permalink={url} data-instgrm-version="14">
        <a href={url} target="_blank" rel="noopener noreferrer">
          View this post on Instagram
        </a>
      </blockquote>
    </div>
  );
}
