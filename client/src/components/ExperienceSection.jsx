import { useEffect, useState } from "react";
import { getExperiences } from "../services/experienceService";

import "../styles/experiences.css";

import InteractiveItem from "./InteractiveItem";

// FORMAT IMAGE URL
const getImageUrl = (image) => {
  if (!image) return "";

  if (image.startsWith("http")) {
    return image;
  }

  return `https://res.cloudinary.com/djp4j1mvn/image/upload/f_auto,q_auto,w_1400/${image}`;
};

const ExperienceSection = () => {
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const data = await getExperiences();

      setExperiences(data);
    } catch (error) {
      console.log(error);
    }
  };

  // FILTER CATEGORIES
  const weddings = experiences.filter(
    (exp) => exp.category === "Wedding Experience",
  );

  const celebrations = experiences.filter(
    (exp) => exp.category === "Social Experience",
  );

  const corporate = experiences.filter(
    (exp) => exp.category === "Corporate Experience",
  );

  // RENDER GROUP
  const renderGroup = (title, items, id = "") => {
    if (items.length === 0) return null;

    return (
      <div className="experience-groups">
        <div className="group">
          <div className="group-label" id={id}>
            {title}
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
    <section className="our-experience">
      <h3>EXPERIENCES</h3>

      {renderGroup("Weddings", weddings)}

      {renderGroup("Celebrations", celebrations, "social")}

      {renderGroup("Corporate", corporate, "corporate")}
    </section>
  );
};

export default ExperienceSection;
