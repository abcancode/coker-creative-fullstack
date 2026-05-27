import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "",
    },

    quote: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

export default Testimonial;
