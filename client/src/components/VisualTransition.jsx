import { useEffect, useState } from "react";

import { getSiteContent } from "../services/siteContentService";

import "../styles/visual-transition.css";

const CLOUD_NAME = "djp4j1mvn";

// CLOUDINARY FORMATTER
const cld = (publicId, w = 1920) =>
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto:best,dpr_auto,w_${w},c_limit/${publicId}`;

const VisualTransition = () => {
  const [images, setImages] = useState([]);

  // FETCH CMS CONTENT
  const fetchContent = async () => {
    try {
      const data = await getSiteContent("home");

      if (data?.visualTransitionImages) {
        setImages(data.visualTransitionImages);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  useEffect(() => {
    const bgA = document.getElementById("visualBgA");

    const bgB = document.getElementById("visualBgB");

    if (!bgA || !bgB) return;

    // FORMAT IMAGES
    const formattedImages = images
      .map((img) => (img.startsWith("http") ? img : cld(img, 1920)))
      .filter(Boolean);

    // SAFETY
    if (!formattedImages.length) return;

    let index = 0;

    let active = bgA;

    let inactive = bgB;

    let isSwapping = false;

    // PRELOAD
    formattedImages.forEach((url) => {
      const img = new Image();

      img.decoding = "async";

      img.src = url;
    });

    // INITIAL IMAGE
    active.style.backgroundImage = `url(${formattedImages[0]})`;

    active.classList.add("active", "zoom");

    inactive.classList.remove("active", "zoom");

    inactive.style.backgroundImage = "";

    const swapTo = (nextIndex) => {
      if (isSwapping) return;

      isSwapping = true;

      const img = new Image();

      img.decoding = "async";

      img.src = formattedImages[nextIndex];

      const doSwap = () => {
        inactive.style.backgroundImage = `url(${formattedImages[nextIndex]})`;

        // RETRIGGER ANIMATION
        void inactive.offsetHeight;

        inactive.classList.add("active", "zoom");

        active.classList.remove("active", "zoom");

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

    const interval = setInterval(() => {
      index = (index + 1) % formattedImages.length;

      swapTo(index);
    }, 6000);

    return () => clearInterval(interval);
  }, [images]);

  return (
    <section className="visual-transition">
      <div className="visual-bg visual-bg-a" id="visualBgA" />

      <div className="visual-bg visual-bg-b" id="visualBgB" />
    </section>
  );
};

export default VisualTransition;
