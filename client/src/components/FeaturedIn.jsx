import { useEffect, useRef, useState } from "react";

import { getBrands } from "../services/featuredBrandService";

// FORMAT IMAGE URL
const getImageUrl = (image) => {
  if (!image) return "";

  if (image.startsWith("http")) {
    return image;
  }

  return `https://res.cloudinary.com/djp4j1mvn/image/upload/f_auto,q_auto,w_1400/${image}`;
};

const FeaturedIn = () => {
  const sectionRef = useRef(null);

  const [brands, setBrands] = useState([]);

  // FETCH BRANDS
  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const data = await getBrands();

      setBrands(data);
    } catch (error) {
      console.log(error);
    }
  };

  // INTERSECTION ANIMATION
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

  // DUPLICATE FOR INFINITE MARQUEE
  const marqueeBrands = [...brands, ...brands];

  return (
    <section className="featured-in" ref={sectionRef}>
      <h2>TRUSTED BY</h2>

      <div className="featured-marquee">
        <div className="featured-track">
          {marqueeBrands.map((brand, index) => (
            <img
              key={`${brand._id}-${index}`}
              src={getImageUrl(brand.logo)}
              alt={index < brands.length ? `${brand.name} Logo` : ""}
              aria-hidden={index >= brands.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedIn;
