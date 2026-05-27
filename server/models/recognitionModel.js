import mongoose from "mongoose";

const recognitionSchema = new mongoose.Schema(
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

const Recognition = mongoose.model("Recognition", recognitionSchema);

export default Recognition;
