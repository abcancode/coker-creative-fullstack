import { useParams } from "react-router-dom";
import HeroExperienceDetails from "../components/HeroExperienceDetails.jsx";
import "../styles/experience-details.css";

import { useEffect, useMemo, useState } from "react";

import { Helmet } from "react-helmet-async";

import { getExperience } from "../services/experienceService";

const CLOUD_NAME = "djp4j1mvn";

// CLOUDINARY URL FORMATTER
const cld = (publicId, w = 1920) =>
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto:best,dpr_auto,w_${w},c_limit/${publicId}`;

// NORMALIZE IMAGE URL
const toUrl = (value, w = 1920) => {
  if (!value) return "";

  const str = String(value);

  // FULL URL
  if (str.startsWith("http://") || str.startsWith("https://")) {
    return str;
  }

  // LOCAL PATH
  if (str.startsWith("/")) {
    return str;
  }

  // CLOUDINARY PUBLIC ID
  return cld(str, w);
};

const ExperienceDetails = () => {
  const { slug } = useParams();

  const [data, setData] = useState(null);

  const [lightboxIndex, setLightboxIndex] = useState(null);

  // FETCH EXPERIENCE
  useEffect(() => {
    fetchExperience();
  }, [slug]);

  const fetchExperience = async () => {
    try {
      const response = await getExperience(slug);

      setData(response);
    } catch (error) {
      console.log(error);
    }
  };

  // HERO IMAGES
  const heroUrls = useMemo(
    () =>
      (data?.heroImages || []).map((img) => toUrl(img, 1920)).filter(Boolean),
    [data],
  );

  // GALLERY IMAGES
  const galleryUrls = useMemo(
    () => (data?.gallery || []).map((img) => toUrl(img, 1600)).filter(Boolean),
    [data],
  );

  // SEO
  const seoTitle = `${data?.title || ""} | Coker Creative`;

  const seoDescription = `Explore the ${
    data?.title || ""
  } curated by Coker Creative — intentional, elegant, and unforgettable.`;

  const seoImage = heroUrls[0] || galleryUrls[0] || "";

  const canonicalUrl = `https://cokercreative.com/experiences/${slug}`;

  // GALLERY ANIMATION
  useEffect(() => {
    const images = document.querySelectorAll(".experience-gallery img");

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");

            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -80px 0px",
      },
    );

    images.forEach((img) => observer.observe(img));

    return () => observer.disconnect();
  }, [slug, data]);

  // LOCK BODY SCROLL
  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? "hidden" : "auto";
  }, [lightboxIndex]);

  // LOADING STATE
  if (!data) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f2ef",
          color: "#401e37",
          fontSize: "18px",
        }}
      >
        Loading experience...
      </div>
    );
  }

  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>{seoTitle}</title>

        <meta name="description" content={seoDescription} />

        <link rel="canonical" href={canonicalUrl} />

        {/* OPEN GRAPH */}
        <meta property="og:title" content={seoTitle} />

        <meta property="og:description" content={seoDescription} />

        {seoImage && <meta property="og:image" content={seoImage} />}

        <meta property="og:type" content="website" />

        <meta property="og:url" content={canonicalUrl} />

        {/* TWITTER */}
        <meta name="twitter:card" content="summary_large_image" />

        <meta name="twitter:title" content={seoTitle} />

        <meta name="twitter:description" content={seoDescription} />

        {seoImage && <meta name="twitter:image" content={seoImage} />}
      </Helmet>

      {/* HERO */}
      <HeroExperienceDetails key={slug} heroImages={heroUrls} />

      {/* INTRO */}
      <section className="experience-intro">
        <h1>{data.title}</h1>

        <div className="experience-meta">
          <span>
            <strong>Category:</strong> {data.category}
          </span>
        </div>

        {data.fullDescription && (
          <p
            style={{
              marginTop: "24px",
              lineHeight: "2",
              color: "#555",
              maxWidth: "900px",
            }}
          >
            {data.fullDescription}
          </p>
        )}
      </section>

      {data.featuredVideo && (
        <section
          style={{
            maxWidth: "1100px",
            margin: "80px auto",
            padding: "0 24px",
            textAlign: "center",
          }}
        >
          <p
            className="video-label"
            style={{
              color: "#8b6b7d",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "12px",
              fontSize: "13px",
            }}
          >
            Behind The Experience
          </p>

          <h2
            style={{
              color: "#401e37",
              marginBottom: "18px",
              fontFamily: "'Bona Nova SC', serif",
            }}
          >
            A conversation with Gozie Coker-Mosuro
          </h2>

          <p
            style={{
              maxWidth: "700px",
              margin: "0 auto 40px",
              color: "#666",
              lineHeight: "1.8",
            }}
          >
            Hear the inspiration, strategy and creative thinking behind this
            experience.
          </p>

          <video
            controls
            playsInline
            preload="metadata"
            poster={heroUrls?.[0]}
            style={{
              width: "100%",
              borderRadius: "24px",
              overflow: "hidden",
            }}
          >
            <source src={data.featuredVideo} type="video/mp4" />
          </video>
        </section>
      )}

      {/* GALLERY */}
      <section className="experience-gallery">
        {galleryUrls.map((src, i) => (
          <img
            key={`${src}-${i}`}
            src={src}
            alt={data.title}
            loading="lazy"
            decoding="async"
            onClick={() => setLightboxIndex(i)}
          />
        ))}
      </section>

      {/* LIGHTBOX */}
      {lightboxIndex !== null && galleryUrls.length > 0 && (
        <div
          className="lightbox-overlay"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="lightbox-close"
            onClick={() => setLightboxIndex(null)}
          >
            ×
          </button>

          <button
            className="lightbox-prev"
            onClick={(e) => {
              e.stopPropagation();

              setLightboxIndex(
                (lightboxIndex - 1 + galleryUrls.length) % galleryUrls.length,
              );
            }}
          >
            ‹
          </button>

          <img
            src={galleryUrls[lightboxIndex]}
            alt=""
            className="lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className="lightbox-next"
            onClick={(e) => {
              e.stopPropagation();

              setLightboxIndex((lightboxIndex + 1) % galleryUrls.length);
            }}
          >
            ›
          </button>
        </div>
      )}
    </>
  );
};

export default ExperienceDetails;
