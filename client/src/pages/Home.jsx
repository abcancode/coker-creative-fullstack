import { Helmet } from "react-helmet-async";

import { useEffect, useState } from "react";

import Hero from "../components/Hero";

import WhatWeDo from "../components/WhatWeDo";

import Testimonials from "../components/Testimonials";

import FeaturedIn from "../components/FeaturedIn";

import { getSiteContent } from "../services/siteContentService";

const Home = () => {
  const [content, setContent] = useState(null);

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

  const seoTitle =
    content?.seoTitle ||
    "Coker Creative | Thoughtfully Curated Event Experiences";

  const seoDescription =
    content?.seoDescription ||
    "Coker Creative curates bespoke weddings, social and corporate event experiences designed with intention, style, and excellence.";

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>

        <meta name="description" content={seoDescription} />

        <link rel="canonical" href="https://cokercreative.com/" />
      </Helmet>

      <Hero />

      <WhatWeDo />

      <FeaturedIn />

      <Testimonials />
    </>
  );
};

export default Home;
