import mongoose from "mongoose";

const featuredBrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    logo: {
      type: String,
      required: true,
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

const FeaturedBrand = mongoose.model("FeaturedBrand", featuredBrandSchema);

export default FeaturedBrand;
