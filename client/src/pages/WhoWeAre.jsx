import { Helmet } from "react-helmet-async";
import WhoWeAreHero from "../components/WhoWeAreHero";
import OurStory from "../components/OurStory";
import CoreValues from "../components/CoreValues";
import Recognition from "../components/Recognition";
import Visionary from "../components/Visionary";
import "../styles/who-we-are.css";

const WhoWeAre = () => {
  return (
    <>
      <Helmet>
        <title>Who We Are | Coker Creative</title>
        <meta
          name="description"
          content="Discover the story, vision, and values behind Coker Creative — a creative company dedicated to thoughtful, immersive event experiences."
        />
        <link rel="canonical" href="https://cokercreative.com/who-we-are" />
      </Helmet>

      <WhoWeAreHero />
      <OurStory />
      <CoreValues />
      <Visionary />
      <Recognition />
    </>
  );
};

export default WhoWeAre;
