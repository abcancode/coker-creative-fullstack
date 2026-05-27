import { useEffect, useRef, useState } from "react";

import "../styles/who-we-are.css";

import { getSiteContent } from "../services/siteContentService";

const CLOUD_NAME = "djp4j1mvn";

// CLOUDINARY HELPER
const cld = (publicId, w = 1920) =>
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto:best,dpr_auto,w_${w},c_limit/${publicId}`;

const fallbackImages = [
  cld("ifzh5rngmdnwb3vc6zqv"),
  cld("pltrnfeouk6xdztco5os"),
  cld("jgjdvpt2riyhxdnedend"),
  cld("uvrk70pmuc5rmcfpfda8"),
  cld("fu0ckanieewrqfx0yprn"),
  cld("a4w4qhd4sh5pgpzvqev6"),
];

const WhoWeAreHero = () => {
  const [isReady, setIsReady] = useState(false);

  const [content, setContent] = useState(null);

  const [images, setImages] = useState(fallbackImages);

  const bgARef = useRef(null);

  const bgBRef = useRef(null);

  const intervalRef = useRef(null);

  // FETCH CMS CONTENT
  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const data = await getSiteContent("home");

      setContent(data);

      // CMS IMAGES
      if (data?.whoHeroImages?.length > 0) {
        const formatted = data.whoHeroImages.map((img) => cld(img));

        setImages(formatted);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // PRELOAD REMAINING IMAGES
  useEffect(() => {
    images.slice(1).forEach((src) => {
      const img = new Image();

      img.decoding = "async";

      img.src = src;
    });
  }, [images]);

  // READINESS SIGNAL
  useEffect(() => {
    const img = new Image();

    const onReady = () => setIsReady(true);

    img.addEventListener("load", onReady);

    img.src = images[0];

    if (img.complete) onReady();

    return () => img.removeEventListener("load", onReady);
  }, [images]);

  // SLIDESHOW
  useEffect(() => {
    const a = bgARef.current;

    const b = bgBRef.current;

    if (!a || !b) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    let index = 0;

    let active = a;

    let inactive = b;

    let isSwapping = false;

    a.className = "who-hero-bg is-active is-zoom";

    b.className = "who-hero-bg";

    b.style.backgroundImage = "";

    const swapTo = (nextIndex) => {
      if (isSwapping) return;

      isSwapping = true;

      const img = new Image();

      img.decoding = "async";

      img.src = images[nextIndex];

      const doSwap = () => {
        inactive.style.backgroundImage = `url(${images[nextIndex]})`;

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
        isSwapping = false;
      };
    };

    intervalRef.current = setInterval(() => {
      index = (index + 1) % images.length;

      swapTo(index);
    }, 6500);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [images]);

  return (
    <section
      className={`who-hero ${isReady ? "is-ready" : ""}`}
      style={{
        backgroundImage: `url(${images[0]})`,
      }}
    >
      <img
        className="who-hero-preload"
        src={images[0]}
        alt=""
        loading="eager"
        fetchpriority="high"
        decoding="async"
      />

      <div
        ref={bgARef}
        className="who-hero-bg is-active is-zoom"
        style={{
          backgroundImage: `url(${images[0]})`,
        }}
      />

      <div ref={bgBRef} className="who-hero-bg" />

      <div className="who-hero-overlay" />

      <div className="who-hero-content">
        <h1>
          {content?.whoHeroTitle ||
            `We never set out to plan events.
We set out to design experiences.`}
        </h1>
      </div>
    </section>
  );
};

export default WhoWeAreHero;
