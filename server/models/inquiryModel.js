import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    name: String,

    email: String,

    phone: String,

    eventDate: String,

    eventType: String,

    estimatedGuestCount: String,

    primaryDecisionMaker: String,

    decisionMakerName: String,

    currency: String,

    budgetRange: String,

    topPriorities: [String],

    desiredMood: String,

    desiredLook: String,

    inspirationImages: [String],

    inspirationLink: String,

    toBeExcluded: String,

    additionalNotes: String,

    status: {
      type: String,
      default: "New",
    },
  },
  {
    timestamps: true,
  },
);

const Inquiry = mongoose.model("Inquiry", inquirySchema);

export default Inquiry;
