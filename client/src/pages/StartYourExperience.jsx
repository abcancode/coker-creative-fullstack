import { Helmet } from "react-helmet-async";
import StartYourExperienceSection from "../components/StartYourExperienceSection";

const StartYourExperience = () => {
  return (
    <>
      <Helmet>
        <title>Start Your Experience | Coker Creative</title>
        <meta
          name="description"
          content="Book a bespoke event experience with Coker Creative. From weddings to corporate and social events, we bring your vision to life."
        />
        <link
          rel="canonical"
          href="https://cokercreative.com/start-your-experience"
        />
      </Helmet>

      <StartYourExperienceSection />
    </>
  );
};

export default StartYourExperience;
