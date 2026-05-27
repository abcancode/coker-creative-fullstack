import { useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";

import "../styles/footer.css";

import { getSiteContent } from "../services/siteContentService";

const Footer = () => {
  const footerRef = useRef(null);

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

  // SOCIAL LINKS
  const socialLinks = {
    instagram:
      content?.footerInstagram || "https://www.instagram.com/cokercreative",

    facebook:
      content?.footerFacebook || "https://www.facebook.com/share/1CBiLUmLNP/",

    twitter: content?.footerTwitter || "https://x.com/CokerCreative",
  };

  // INTERSECTION OBSERVER
  useEffect(() => {
    const footer = footerRef.current;

    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          footer.classList.add("footer-visible");

          observer.disconnect();
        }
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    observer.observe(footer);

    return () => observer.disconnect();
  }, []);

  return (
    <footer className="footer" ref={footerRef}>
      {/* TOP */}
      <div className="footer-top">
        <h2 className="footer-heading">
          <span className="footer-line-strong">
            {content?.footerTitleLine1 || "Every detail considered."}
          </span>

          <span className="footer-line-strong">
            {content?.footerTitleLine2 || "Every moment intentional."}
          </span>

          <span className="footer-line-soft">
            {content?.footerTitleLine3 || "All you’ll need to do is arrive."}
          </span>
        </h2>

        <Link
          to={content?.footerButtonLink || "/start-your-experience"}
          className="btn btn-light btn-cta"
        >
          <span className="cta-main">
            {content?.footerButtonText || "START YOUR EXPERIENCE"}{" "}
            <span className="cta-arrow">→</span>
          </span>
        </Link>
      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <div className="footer-logo">
            <img
              src="/assets/images/coker-creative-logo.png"
              alt="Coker Creative"
            />
          </div>

          <nav className="footer-links">
            <Link to="/who-we-are">WHO WE ARE</Link>

            <Link to="/experiences">EXPERIENCES</Link>

            <Link to="/start-your-experience">START YOUR EXPERIENCE</Link>
          </nav>

          {/* SOCIALS */}
          <div className="socials">
            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram" />
              </a>
            )}

            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook" />
              </a>
            )}

            {socialLinks.twitter && (
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
              >
                <i className="fab fa-x-twitter" />
              </a>
            )}
          </div>
        </div>

        {/* CONTACT */}
        <div className="footer-contact">
          <p className="footer-contact-main">
            {content?.footerEmail || "info@cokercreative.com"}

            <span className="dot">·</span>

            {content?.footerHandle || "@cokercreative"}
          </p>

          <p className="footer-contact-meta">
            {content?.footerLocations || "Houston, TX · Lagos · Worldwide"}
          </p>
        </div>

        <hr />

        <p className="copyright">
          {content?.footerCopyright || "@2026 COKER CREATIVE"}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
