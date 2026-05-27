import { useEffect, useState } from "react";

import { getSiteContent } from "../services/siteContentService";

const CLOUD_NAME = "djp4j1mvn";

// CLOUDINARY HELPER
const cld = (publicId, w = 1200) =>
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto:best,dpr_auto,w_${w},c_limit/${publicId}`;

const fallbackImages = [
  "/assets/images/story-1.jpeg",
  "/assets/images/story-2.png",
  "/assets/images/story-3.png",
];

const OurStory = () => {
  const [content, setContent] = useState(null);

  const [images, setImages] = useState(fallbackImages);

  // FETCH CMS CONTENT
  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const data = await getSiteContent("home");

      setContent(data);

      // CMS IMAGES
      if (data?.ourStoryImages?.length > 0) {
        const formatted = data.ourStoryImages.map((img) => cld(img));

        setImages(formatted);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="our-story">
      <div className="our-story-inner">
        {/* LEFT: IMAGE GALLERY */}
        <div className="story-gallery">
          <div className="story-image tall">
            <img src={images[0]} alt="Our Story Image 1" />
          </div>

          <div className="story-image small">
            <img src={images[1]} alt="Our Story Image 2" />
          </div>

          <div className="story-image small">
            <img src={images[2]} alt="Our Story Image 3" />
          </div>
        </div>

        {/* RIGHT: TEXT */}
        <div className="story-content">
          <h2>{content?.ourStoryTitle || "The blueprint came first."}</h2>

          <p>
            {content?.ourStoryParagraph1 ||
              `I wrote the business plan for
Coker Creative as my MSc thesis at
Bayes Business School, London.
Not as a hypothetical — as a
company I intended to build.
I took it back to Nigeria and
built exactly what I had written.`}
          </p>

          <p>
            {content?.ourStoryParagraph2 ||
              `From day one, the title was
Chief Experience Designer.
That distinction was intentional —
and it still defines everything
we do.`}
          </p>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
