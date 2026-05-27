import { useEffect, useRef, useState } from "react";
import "../styles/experiences.css";

const CLOUD_NAME = "djp4j1mvn";

const IMAGES = [
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto:best,w_1920,c_limit/jgjdvpt2riyhxdnedend.jpg`,
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto:best,w_1920,c_limit/vwkd4vtiyl4apqfrpt3s.jpg`,
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto:best,w_1920,c_limit/pmoxotlqjbi0hmaodfvq.jpg`,
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto:best,w_1920,c_limit/sffsanykjwvvtmd4qxf4.jpg`,
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto:best,w_1920,c_limit/huu4jb9evsj3wqkyckq9.jpg`,
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto:best,w_1920,c_limit/cnqr30egfinnqfzxl3tv.jpg`,
];

const HeroExperience = () => {
  const [isReady, setIsReady] = useState(false);

  const bgARef = useRef(null);
  const bgBRef = useRef(null);
  const intervalRef = useRef(null);

  /* preload remaining images AFTER first paint */
  useEffect(() => {
    IMAGES.slice(1).forEach((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    });
  }, []);

  /* match Homepage Hero readiness logic */
  useEffect(() => {
    const img = new Image();
    const onReady = () => setIsReady(true);

    img.addEventListener("load", onReady);
    img.src = IMAGES[0];

    if (img.complete) onReady();

    return () => img.removeEventListener("load", onReady);
  }, []);

  /* slideshow (bgA active on first paint) */
  useEffect(() => {
    const a = bgARef.current;
    const b = bgBRef.current;
    if (!a || !b) return;

    let index = 0;
    let active = a;
    let inactive = b;
    let isSwapping = false;

    a.className = "exp-hero-bg is-active is-zoom";
    b.className = "exp-hero-bg";
    b.style.backgroundImage = "";

    const swapTo = (nextIndex) => {
      if (isSwapping) return;
      isSwapping = true;

      const img = new Image();
      img.decoding = "async";
      img.src = IMAGES[nextIndex];

      const doSwap = () => {
        inactive.style.backgroundImage = `url(${IMAGES[nextIndex]})`;
        inactive.classList.add("is-active", "is-zoom");
        active.classList.remove("is-active", "is-zoom");
        [active, inactive] = [inactive, active];
        isSwapping = false;
      };

      img.complete ? doSwap() : (img.onload = doSwap);
    };

    intervalRef.current = setInterval(() => {
      index = (index + 1) % IMAGES.length;
      swapTo(index);
    }, 6500);

    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <section
      className={`exp-hero ${isReady ? "is-ready" : ""}`}
      style={{ backgroundImage: `url(${IMAGES[0]})` }}
    >
      {/* eager fetch, hidden */}
      <img
        className="exp-hero-preload"
        src={IMAGES[0]}
        alt=""
        loading="eager"
        fetchpriority="high"
        decoding="async"
      />

      <div
        ref={bgARef}
        className="exp-hero-bg is-active is-zoom"
        style={{ backgroundImage: `url(${IMAGES[0]})` }}
      />
      <div ref={bgBRef} className="exp-hero-bg" />

      <div className="exp-hero-overlay" />

      <div className="exp-hero-content">
        <h1>
          <span className="exp-hero-title">The Work.</span>
          <span className="exp-hero-sub">
            Every event here started as a question about what a moment could
            feel like.
          </span>
        </h1>
      </div>
    </section>
  );
};

export default HeroExperience;
