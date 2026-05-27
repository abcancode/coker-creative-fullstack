import { useEffect, useState } from "react";

import { getRecognitions } from "../services/recognitionService";

import "../styles/recognition.css";

const CLOUD_NAME = "djp4j1mvn";

// CLOUDINARY HELPER
const cld = (publicId, w = 600) =>
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto:best,dpr_auto,w_${w},c_limit/${publicId}`;

const fallbackRecognitions = [
  {
    name: "Forbes",
    logo: "/assets/images/forbes.png",
  },

  {
    name: "Sabre Awards",
    logo: "/assets/images/sabre.png",
  },

  {
    name: "ILEA",
    logo: "/assets/images/ilea.jpg",
  },
];

const Recognition = () => {
  const [recognitions, setRecognitions] = useState(fallbackRecognitions);

  // FETCH RECOGNITIONS
  useEffect(() => {
    fetchRecognitions();
  }, []);

  const fetchRecognitions = async () => {
    try {
      const data = await getRecognitions();

      // ONLY replace if data exists
      if (data && data.length > 0) {
        const formatted = data.map((recognition) => ({
          ...recognition,

          logo: cld(recognition.logo),
        }));

        setRecognitions(formatted);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="recognition">
      <h3>Recognition</h3>

      <div className="logos">
        {recognitions.map((recognition, index) => (
          <img
            key={recognition._id || index}
            id={recognition.name === "Forbes" ? "forbes-img" : ""}
            src={recognition.logo}
            alt={recognition.name}
          />
        ))}
      </div>
    </section>
  );
};

export default Recognition;
