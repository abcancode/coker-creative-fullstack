import { Link } from "react-router-dom";

import { useEffect, useRef, useState } from "react";

import "../styles/hero.css";

import { getSiteContent } from "../services/siteContentService";

import { trackCTAClick } from "../services/analyticsService";

const Hero = () => {
  const videoRef = useRef(null);

  const [isReady, setIsReady] = useState(false);

  const [content, setContent] = useState(null);

  // FETCH CONTENT
  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const data = await getSiteContent("home");

      setContent(data);
    } catch (error) {
      console.log(error);
    }
  };

  // CONFETTI
  const handleWelcomeClick = () => {
    if (!window.confetti) return;

    if (sessionStorage.getItem("welcomeConfettiPlayed")) return;

    sessionStorage.setItem("welcomeConfettiPlayed", "true");

    window.confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.75 },
      colors: ["#ffffff", "#f0ede9", "#a35da1"],
      scalar: 0.9,
      ticks: 200,
    });
  };

  // VIDEO READY
  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const onReady = () => setIsReady(true);

    video.addEventListener("loadeddata", onReady);

    video.addEventListener("canplay", onReady);

    if (video.readyState >= 2) onReady();

    return () => {
      video.removeEventListener("loadeddata", onReady);

      video.removeEventListener("canplay", onReady);
    };
  }, [content]);

  // FALLBACKS
  const heroTitle = content?.heroTitle || "Experience Design. Nothing less.";

  const heroVideo =
    content?.heroVideo ||
    "https://res.cloudinary.com/djp4j1mvn/video/upload/f_auto,q_auto:best,vc_auto,ac_none,w_1920,c_limit/v1785964620/wbmr0pzvktypn0aovhh3.mp4";

  const heroPoster =
    content?.heroPoster || "/assets/images/home-hero-fallback.png";

  const primaryButtonText = content?.primaryButtonText || "View Our Work";

  const primaryButtonLink = content?.primaryButtonLink || "/experiences";

  const secondaryButtonText =
    content?.secondaryButtonText || "Start Your Experience";

  const secondaryButtonLink =
    content?.secondaryButtonLink || "/start-your-experience";

  return (
    <section className={`hero hero-home ${isReady ? "hero-ready" : ""}`}>
      <video
        ref={videoRef}
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={heroPoster}
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      <div className="hero-overlay" />

      <div className="hero-content">
        <h1>{heroTitle}</h1>

        <div className="hero-buttons">
          <Link
            to={primaryButtonLink}
            className="btn btn-outline"
            onClick={() =>
              trackCTAClick({
                buttonName: primaryButtonText,
                section: "Hero",
              }).catch(console.error)
            }
          >
            {primaryButtonText}
          </Link>

          <Link
            to={secondaryButtonLink}
            className="btn btn-filled"
            onClick={() =>
              trackCTAClick({
                buttonName: secondaryButtonText,
                section: "Hero",
              }).catch(console.error)
            }
          >
            {secondaryButtonText}
          </Link>
        </div>
      </div>

      <a
        href="#what-we-do"
        className="hero-scroll"
        onClick={handleWelcomeClick}
      >
        <span className="welcome-text">WELCOME</span>

        <span className="scroll-arrow" />
      </a>
    </section>
  );
};

export default Hero;
