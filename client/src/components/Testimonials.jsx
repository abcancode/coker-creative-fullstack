import { useEffect, useMemo, useRef, useState } from "react";

import "../styles/testimonials.css";

import { getTestimonials } from "../services/testimonialService";

// FORMAT IMAGE URL
const getImageUrl = (image) => {
  if (!image) return "";

  if (image.startsWith("http")) {
    return image;
  }

  return `https://res.cloudinary.com/djp4j1mvn/image/upload/f_auto,q_auto,w_1400/${image}`;
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  const [index, setIndex] = useState(0);

  const [animating, setAnimating] = useState(false);

  const [currentSrc, setCurrentSrc] = useState("");

  const imgRef = useRef(null);

  const textRef = useRef(null);

  const authorRef = useRef(null);

  // FETCH TESTIMONIALS
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const data = await getTestimonials();

      setTestimonials(data);

      if (data.length > 0) {
        setCurrentSrc(getImageUrl(data[0].image));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // PRELOAD IMAGES
  const imagesToPreload = useMemo(() => {
    return Array.from(
      new Set(testimonials.map((t) => getImageUrl(t.image)).filter(Boolean)),
    );
  }, [testimonials]);

  useEffect(() => {
    imagesToPreload.forEach((src) => {
      const img = new Image();

      img.decoding = "async";

      img.src = src;
    });
  }, [imagesToPreload]);

  // INITIAL SET
  useEffect(() => {
    if (testimonials.length === 0) return;

    const t = testimonials[index];

    if (textRef.current) textRef.current.textContent = t.quote;

    if (authorRef.current) authorRef.current.textContent = t.name;

    setCurrentSrc(getImageUrl(t.image));
  }, [testimonials]);

  // IMAGE LOADER
  const loadImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();

      img.onload = () => resolve(true);

      img.onerror = () => resolve(false);

      img.src = src;
    });
  };

  // UPDATE TESTIMONIAL
  const updateTestimonial = async (newIndex) => {
    if (animating || testimonials.length === 0) return;

    const imgEl = imgRef.current;

    const textEl = textRef.current;

    const authorEl = authorRef.current;

    if (!imgEl || !textEl || !authorEl) return;

    const nextT = testimonials[newIndex];

    const nextImage = getImageUrl(nextT.image);

    setAnimating(true);

    // FADE OUT
    imgEl.classList.remove("fade-in");

    textEl.classList.remove("fade-in");

    authorEl.classList.remove("fade-in");

    imgEl.classList.add("fade-out");

    textEl.classList.add("fade-out");

    authorEl.classList.add("fade-out");

    // WAIT FOR IMAGE
    await loadImage(nextImage);

    // SWAP
    setCurrentSrc(nextImage);

    textEl.textContent = nextT.quote;

    authorEl.textContent = nextT.name;

    // FADE IN
    requestAnimationFrame(() => {
      imgEl.classList.remove("fade-out");

      textEl.classList.remove("fade-out");

      authorEl.classList.remove("fade-out");

      imgEl.classList.add("fade-in");

      textEl.classList.add("fade-in");

      authorEl.classList.add("fade-in");

      setIndex(newIndex);

      setTimeout(() => setAnimating(false), 400);
    });
  };

  // NEXT
  const next = () => updateTestimonial((index + 1) % testimonials.length);

  // PREV
  const prev = () =>
    updateTestimonial((index - 1 + testimonials.length) % testimonials.length);

  // EMPTY STATE
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="testimonials" id="testimonials">
      <div className="testimonial-box">
        <img
          ref={imgRef}
          src={currentSrc}
          alt="Client"
          id="testimonialImage"
          loading="eager"
          decoding="async"
        />

        <div className="testimonial-content">
          <h3>WHAT OUR CLIENTS SAY</h3>

          <i className="fa-solid fa-quote-left quote-icon"></i>

          <p id="testimonialText" ref={textRef}>
            {testimonials[0]?.quote}
          </p>

          <span className="author" id="testimonialAuthor" ref={authorRef}>
            {testimonials[0]?.name}
          </span>

          <div className="testimonial-nav">
            <button aria-label="Previous testimonial" onClick={prev}>
              &lt;
            </button>

            <button aria-label="Next testimonial" onClick={next}>
              &gt;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
