import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    category: {
      type: String,
      required: true,
    },

    fullDescription: {
      type: String,
      default: "",
    },

    heroImages: {
      type: [String],
      default: [],
    },

    gallery: {
      type: [String],
      default: [],
    },

    featuredVideo: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Experience = mongoose.model("Experience", experienceSchema);

export default Experience;
