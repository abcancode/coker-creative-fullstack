import dotenv from "dotenv";
import mongoose from "mongoose";

import Experience from "./models/Experience.js";
import experiences from "./data/experiencesData.js";

dotenv.config();

// CONNECT DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    try {
      // CLEAR EXISTING
      await Experience.deleteMany();

      console.log("Old experiences removed");

      // CONVERT OBJECT TO ARRAY
      const formattedExperiences = Object.entries(experiences).map(
        ([slug, data]) => ({
          slug,

          title: data.title,

          category: data.category,

          gallery: data.gallery || [],

          shortDescription: "",

          description: "",

          location: "",

          seoTitle: data.title,

          seoDescription: data.category,
        }),
      );

      // INSERT INTO DB
      await Experience.insertMany(formattedExperiences);

      console.log("Experiences imported successfully");

      process.exit();
    } catch (error) {
      console.log(error);

      process.exit(1);
    }
  })
  .catch((err) => console.log(err));
