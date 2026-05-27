import { Link } from "react-router-dom";
import { useRef, useState, useEffect, useMemo } from "react";

/* ✅ Cloudinary normalize (same pattern as your other pages) */
const CLOUD_NAME = "djp4j1mvn";

const cldImage = (publicId, w = 1200) =>
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto:best,dpr_auto,w_${w},c_limit/${publicId}`;

const cldVideo = (publicId) =>
  `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/f_auto,q_auto/${publicId}`;

const toUrl = (value, w = 1200) => {
  if (!value) return "";
  const str = String(value);
  if (str.startsWith("http://") || str.startsWith("https://")) return str;
  if (str.startsWith("/")) return str; // local path
  return cldImage(str, w); // Cloudinary image public id
};

const toVideoUrl = (value) => {
  if (!value) return "";
  const str = String(value);
  if (str.startsWith("http://") || str.startsWith("https://")) return str;
  if (str.startsWith("/")) return str; // local path
  return cldVideo(str); // Cloudinary video public id
};

const InteractiveItem = ({
  image,
  title,
  slug,
  video,
  slideshow = [],
  disableTitle = false,
}) => {
  const videoRef = useRef(null);
  const intervalRef = useRef(null);

  const [active, setActive] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [canHover, setCanHover] = useState(false);

  const hasSlideshow = slideshow.length > 0;
  const hasVideo = !!video;

  /* ✅ normalize sources */
  const baseSrc = useMemo(() => toUrl(image, 1200), [image]);
  const videoSrc = useMemo(() => toVideoUrl(video), [video]);

  const slideshowUrls = useMemo(
    () => (slideshow || []).map((s) => toUrl(s, 1200)).filter(Boolean),
    [slideshow],
  );

  // ✅ Enable hover features only on real hover devices
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(!!mq.matches);
    update();

    if (mq.addEventListener) mq.addEventListener("change", update);
    else mq.addListener(update);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", update);
      else mq.removeListener(update);
    };
  }, []);

  // ✅ Preload base + slideshow images
  const preloadList = useMemo(() => {
    const list = new Set();
    if (baseSrc) list.add(baseSrc);
    if (hasSlideshow) slideshowUrls.forEach((s) => s && list.add(s));
    return Array.from(list);
  }, [baseSrc, hasSlideshow, slideshowUrls]);

  useEffect(() => {
    if (!canHover) return;
    preloadList.forEach((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    });
  }, [preloadList, canHover]);

  // ✅ Warm up video on mount
  useEffect(() => {
    if (!canHover || !hasVideo || !videoRef.current) return;
    const v = videoRef.current;
    v.preload = "auto";
    v.load();
  }, [canHover, hasVideo, videoSrc]);

  const startMedia = () => {
    if (!canHover || active) return;

    setActive(true);

    if (hasSlideshow && slideshowUrls.length) {
      intervalRef.current = setInterval(() => {
        setSlideIndex((i) => (i + 1) % slideshowUrls.length);
      }, 1200);
    }

    if (hasVideo && videoRef.current) {
      const v = videoRef.current;
      v.muted = isMuted;
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  };

  const stopMedia = () => {
    if (!canHover) return;

    setActive(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setSlideIndex(0);

    if (videoRef.current) {
      const v = videoRef.current;
      v.pause();
      v.currentTime = 0;
      v.muted = true;
    }
    setIsMuted(true);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const toggleMute = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const v = videoRef.current;
    if (!v) return;

    const nextMuted = !isMuted;
    v.muted = nextMuted;
    setIsMuted(nextMuted);

    if (active) v.play().catch(() => {});
  };

  return (
    <div
      className={`interactive-item ${active ? "active" : ""}`}
      onPointerEnter={canHover ? startMedia : undefined}
      onPointerLeave={canHover ? stopMedia : undefined}
    >
      <div className="item-media">
        <img src={baseSrc} alt={title} className="item-image" loading="lazy" />

        {hasVideo && canHover && (
          <video
            ref={videoRef}
            className="item-video"
            src={videoSrc}
            muted={isMuted}
            loop
            playsInline
            preload="metadata"
          />
        )}

        {hasSlideshow && canHover && slideshowUrls.length > 0 && (
          <div className="item-slideshow">
            <img src={slideshowUrls[slideIndex]} alt="" loading="eager" />
          </div>
        )}

        {hasVideo && canHover && active && (
          <button
            type="button"
            className="video-audio-toggle"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
            onClick={toggleMute}
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
        )}
      </div>

      {disableTitle ? (
        <span className="item-title item-title--inactive">{title}</span>
      ) : (
        <Link to={`/experiences/${slug}`} className="item-title">
          {title}
        </Link>
      )}
    </div>
  );
};

export default InteractiveItem;
