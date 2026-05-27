import { useEffect, useState } from "react";

import "../styles/what-we-do.css";

import InteractiveItem from "./InteractiveItem";

import { getExperiences } from "../services/experienceService";

import { getSiteContent } from "../services/siteContentService";

// FORMAT IMAGE URL
const getImageUrl = (image) => {
  if (!image) return "";

  if (image.startsWith("http")) {
    return image;
  }

  return `https://res.cloudinary.com/djp4j1mvn/image/upload/f_auto,q_auto,w_1400/${image}`;
};

const WhatWeDo = () => {
  const [content, setContent] = useState(null);

  const [experiences, setExperiences] = useState([]);

  // FETCH CONTENT
  useEffect(() => {
    fetchContent();

    fetchExperiences();
  }, []);

  const fetchContent = async () => {
    try {
      const data = await getSiteContent("home");

      setContent(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchExperiences = async () => {
    try {
      const data = await getExperiences();
      setExperiences(data);
    } catch (error) {
      console.log(error);
    }
  };

  // FILTER GROUPS
  const weddings = experiences.filter(
    (exp) => exp.category?.trim() === "Wedding Experience",
  );

  const social = experiences.filter(
    (exp) => exp.category?.trim() === "Social Experience",
  );

  const corporate = experiences.filter(
    (exp) => exp.category?.trim() === "Corporate Experience",
  );

  // RENDER GROUP
  const renderGroup = (label, items, id = "") => {
    if (items.length === 0) return null;

    return (
      <div className="experience-groups">
        <div className="group">
          <div className="group-label" id={id}>
            {label}
          </div>

          <div className="group-items">
            {items.map((experience) => (
              <InteractiveItem
                key={experience._id}
                image={getImageUrl(experience.heroImages?.[0])}
                title={experience.title}
                slug={experience.slug}
                slideshow={
                  experience.heroImages
                    ?.slice(1)
                    .map((img) => getImageUrl(img)) || []
                }
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="what-we-do" id="what-we-do">
      <h3>{content?.whatWeDoTitle || "Coker Creative"}</h3>

      <p>
        {content?.whatWeDoDescription ||
          `Founded in 2014 by Gozie Coker Mosuro — Chief Experience Designer from
        day one. Seven countries. Two international awards. Every experience
        design is built entirely around your brief. No templates. No repeated
        formats. Concept to execution, every detail considered.`}
      </p>

      {renderGroup("Weddings", weddings)}

      {renderGroup("Celebrations", social, "social")}

      {renderGroup("Corporate", corporate, "corporate")}
    </section>
  );
};

export default WhatWeDo;
