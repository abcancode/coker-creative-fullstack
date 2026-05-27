import { useEffect, useRef, useState } from "react";

import { getSiteContent } from "../services/siteContentService";

const CoreValues = () => {
  const [content, setContent] = useState(null);

  const blocksRef = useRef([]);

  // FETCH CMS CONTENT
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

  // INTERSECTION ANIMATION
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.25,
        rootMargin: "0px 0px -60px 0px",
      },
    );

    blocksRef.current.forEach((block) => {
      if (block) observer.observe(block);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="core-values">
      <div className="core-grid">
        {/* TOP LEFT */}
        <div
          className="core-block core-text left"
          ref={(el) => (blocksRef.current[0] = el)}
        >
          <h2>{content?.coreValuesTitle || "Core Values"}</h2>

          <p>
            {content?.coreValuesDescription ||
              `At Coker Creative,
we believe the journey to your
event should be just as beautiful
as the celebration itself.
With thoughtful planning and
impeccable execution, we craft
refined, one-of-a-kind experiences
that are uniquely tailored yet
unforgettable for every guest—
because no two clients,
and no two celebrations,
are ever the same.`}
          </p>
        </div>

        {/* TOP RIGHT */}
        <div
          className="core-block core-image image-dark"
          ref={(el) => (blocksRef.current[1] = el)}
        >
          <h3>{content?.coreValueOne || "Intention With Purpose"}</h3>
        </div>

        {/* BOTTOM LEFT */}
        <div
          className="core-block core-image image-soft"
          ref={(el) => (blocksRef.current[2] = el)}
        >
          <h3>{content?.coreValueTwo || "Luxury in Every Detail"}</h3>
        </div>

        {/* BOTTOM RIGHT */}
        <div
          className="core-block core-text center"
          ref={(el) => (blocksRef.current[3] = el)}
        >
          <h3>{content?.coreValueThree || "Elevated Service"}</h3>
        </div>
      </div>
    </section>
  );
};

export default CoreValues;
