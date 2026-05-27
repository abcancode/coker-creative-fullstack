// HeroExperienceDetails.jsx
import { useEffect, useRef, useState } from "react";
import "../styles/hero-experience-details.css";

const CLOUD_NAME = "djp4j1mvn";

// ✅ Cloudinary helper (upload) — fast + best quality adapt
const cld = (publicId, w = 1920) =>
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto:best,dpr_auto,w_${w},c_limit/${publicId}`;

const HeroExperienceDetails = ({ heroImages = [] }) => {
  const [isReady, setIsReady] = useState(false);

  const bgARef = useRef(null);
  const bgBRef = useRef(null);
  const intervalRef = useRef(null);

  // ✅ Normalize heroImages: allow public IDs OR full urls
  const IMAGES = (heroImages || []).filter(Boolean).map((img) => {
    // if it's already a full URL, keep it
    if (typeof img === "string" && img.startsWith("http")) return img;
    // else assume it's a Cloudinary public_id
    return cld(img);
  });

  // preload rest (after mount)
  useEffect(() => {
    if (IMAGES.length <= 1) return;
    IMAGES.slice(1).forEach((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    });
  }, [IMAGES]);

  // readiness signal (overlay only). do NOT block first paint.
  useEffect(() => {
    if (!IMAGES.length) return;

    const img = new Image();
    const onReady = () => setIsReady(true);

    img.addEventListener("load", onReady);
    img.src = IMAGES[0];

    if (img.complete) onReady();

    return () => img.removeEventListener("load", onReady);
  }, [IMAGES]);

  // slideshow (bgA active on first paint)
  useEffect(() => {
    if (!IMAGES.length) return;

    const a = bgARef.current;
    const b = bgBRef.current;
    if (!a || !b) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    let index = 0; // IMAGES[0] already showing
    let active = a;
    let inactive = b;
    let isSwapping = false;

    // route-change safe reset while keeping bgA active
    a.className = "hero-details-bg is-active is-zoom";
    b.className = "hero-details-bg";
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

      if (img.complete) {
        doSwap();
        return;
      }

      img.onload = doSwap;
      img.onerror = () => {
        isSwapping = false; // skip instead of flashing blank
      };
    };

    intervalRef.current = setInterval(() => {
      index = (index + 1) % IMAGES.length;
      swapTo(index);
    }, 6500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [IMAGES]);

  if (!IMAGES.length) {
    return <section className="hero-details-wrap" />;
  }

  return (
    <section
      className={`hero-details-wrap ${isReady ? "is-ready" : ""}`}
      style={{
        // ✅ instant first paint
        backgroundImage: `url(${IMAGES[0]})`,
      }}
    >
      {/* ✅ eager hidden preload */}
      <img
        className="hero-details-preload"
        src={IMAGES[0]}
        alt=""
        loading="eager"
        fetchpriority="high"
        decoding="async"
      />

      {/* ✅ bgA active from first paint */}
      <div
        ref={bgARef}
        className="hero-details-bg is-active is-zoom"
        style={{ backgroundImage: `url(${IMAGES[0]})` }}
      />
      <div ref={bgBRef} className="hero-details-bg" />

      <div className="hero-details-overlay" />
    </section>
  );
};

export default HeroExperienceDetails;
