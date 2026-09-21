"use client";

import { useEffect, useRef, useState } from "react";
import type { EuMotionStory } from "../../lib/eu-visual";

export default function MotionStory({ story }: { story: EuMotionStory }) {
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [userPaused, setUserPaused] = useState(false);
  const [manualPlay, setManualPlay] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { setReduced(media.matches); setManualPlay(false); };
    update(); media.addEventListener("change", update);
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (entry.isIntersecting) setLoaded(true);
    }, { root: frame.current?.closest(".eu-viewer-scroll"), threshold: .15 });
    if (frame.current) observer.observe(frame.current);
    return () => { observer.disconnect(); media.removeEventListener("change", update); };
  }, []);

  useEffect(() => {
    const element = video.current;
    if (!element || !loaded) return;
    let disposed = false;
    const update = () => {
      if (visible && !document.hidden && (!reduced || manualPlay) && !userPaused) {
        element.play().then(() => {
          if (disposed || document.hidden) element.pause();
        }).catch(() => { /* The play button remains available if autoplay is blocked. */ });
      } else element.pause();
    };
    update(); document.addEventListener("visibilitychange", update);
    return () => { disposed = true; document.removeEventListener("visibilitychange", update); element.pause(); };
  }, [loaded, visible, reduced, userPaused, manualPlay]);

  function togglePlayback() {
    if (!video.current) return;
    if (playing) { setUserPaused(true); video.current.pause(); }
    else { setManualPlay(true); setUserPaused(false); video.current.play().catch(() => setFailed(true)); }
  }

  return <figure className="eu-motion-story">
    <div ref={frame} className="eu-motion-frame">
      <video ref={video} src={loaded ? story.src : undefined} width={story.width} height={story.height}
        preload={loaded ? "metadata" : "none"} muted loop playsInline
        aria-label={story.alt} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)} />
    </div>
    <figcaption><div><h3>{story.title}</h3><p>{story.subtitle}</p></div>
      <button type="button" onClick={togglePlayback} disabled={!loaded} aria-label={`${playing ? "Pause" : "Play"} ${story.title}`}>{playing ? "Pause" : "Play"} <span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span></button>
    </figcaption>
    {failed && <p role="status">Playback unavailable. <a href={story.src} target="_blank" rel="noreferrer">Open video ↗</a></p>}
  </figure>;
}
