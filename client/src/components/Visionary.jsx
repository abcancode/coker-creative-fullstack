import { useEffect, useRef, useState } from "react";

import { getSiteContent } from "../services/siteContentService";

const CLOUD_NAME = "djp4j1mvn";

// CLOUDINARY HELPER
const cld = (publicId, w = 1200) =>
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto:best,dpr_auto,w_${w},c_limit/${publicId}`;

const fallbackImage = "/assets/images/gozie-coker.jpg";

const Visionary = () => {
  const [content, setContent] = useState(null);

  const [image, setImage] = useState(fallbackImage);

  const sectionRef = useRef(null);

  // FETCH CMS CONTENT
  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const data = await getSiteContent("home");

      setContent(data);

      // CMS IMAGE
      if (data?.visionaryImage) {
        setImage(cld(data.visionaryImage));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // INTERSECTION OBSERVER
  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("in-view");

          observer.unobserve(section);
        }
      },
      {
        threshold: 0.3,
      },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="visionary" ref={sectionRef}>
      <div className="visionary-inner">
        {/* TEXT */}
        <div className="visionary-text">
          <h2>
            {content?.visionaryTitle || `THE VISIONARY BEHIND THE `}
            <span className="experiences">EXPERIENCES</span>
          </h2>

          <p>
            {content?.visionaryDescription ||
              `Gozie Coker Mosuro is the founder and Chief Experience Designer of
Coker Creative — a title she has held from the company's first
day in 2014. She built the blueprint for Coker Creative as her MSc
thesis at Bayes Business School, London, then returned to Nigeria
and built the company she had written. Coker Creative has produced
across 7 countries, won a SABRE Award for the SheaMoisture Shea on
the Beach campaign, and created the Nigerian Wedding After Party as
a designed concept. She is a recipient of the prestigious 2019
Forbes 30 Under 30 Africa award.`}
          </p>

          <h3>{content?.visionaryName || "Gozie Coker Mosuro"}</h3>

          <span className="role">
            {content?.visionaryRole || "Chief Experience Designer"}
          </span>
        </div>

        {/* IMAGE */}
        <div className="visionary-image">
          <img src={image} alt={content?.visionaryName || "Visionary"} />
        </div>
      </div>
    </section>
  );
};

export default Visionary;
