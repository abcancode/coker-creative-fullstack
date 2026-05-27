import { Helmet } from "react-helmet-async";
import HeroExperience from "../components/HeroExperience";
import ExperienceSection from "../components/ExperienceSection";
import VisualTransition from "../components/VisualTransition";

const Experiences = () => {
  return (
    <>
      <Helmet>
        <title>Our Experiences | Coker Creative</title>
        <meta
          name="description"
          content="Explore the curated experiences by Coker Creative — weddings, social celebrations, and corporate events designed with intention and style."
        />
        <link rel="canonical" href="https://cokercreative.com/experiences" />
      </Helmet>

      <HeroExperience />
      <ExperienceSection />
      <VisualTransition />
    </>
  );
};

export default Experiences;
