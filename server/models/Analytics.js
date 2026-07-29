import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    // Event Type
    event: {
      type: String,
      required: true,
      trim: true,
    },

    // Session Information
    sessionId: {
      type: String,
      required: true,
      index: true,
    },

    visitorId: {
      type: String,
      default: "",
      index: true,
    },

    source: {
      type: String,
      enum: ["website", "admin", "mobile", "api"],
      default: "website",
    },

    // Page Information
    page: {
      type: String,
      default: "",
      trim: true,
    },

    title: {
      type: String,
      default: "",
      trim: true,
    },

    referrer: {
      type: String,
      default: "",
      trim: true,
    },

    // Visitor Information
    visitor: {
      browser: {
        type: String,
        default: "",
      },

      os: {
        type: String,
        default: "",
      },

      device: {
        type: String,
        enum: ["Desktop", "Tablet", "Mobile", "Unknown"],
        default: "Unknown",
      },

      language: {
        type: String,
        default: "",
      },

      ipAddress: {
        type: String,
        default: "",
      },

      country: {
        type: String,
        default: "",
      },

      region: {
        type: String,
        default: "",
      },

      city: {
        type: String,
        default: "",
      },

      screenResolution: {
        type: String,
        default: "",
      },
    },

    // Event Metadata
    metadata: {
      experienceSlug: {
        type: String,
        default: "",
      },

      experienceTitle: {
        type: String,
        default: "",
      },

      videoTitle: {
        type: String,
        default: "",
      },

      buttonName: {
        type: String,
        default: "",
      },

      section: {
        type: String,
        default: "",
      },

      searchQuery: {
        type: String,
        default: "",
      },

      fileName: {
        type: String,
        default: "",
      },

      duration: {
        type: Number,
        default: 0,
      },

      watchPercentage: {
        type: Number,
        default: 0,
      },

      // Marketing Attribution
      utmSource: {
        type: String,
        default: "",
      },

      utmMedium: {
        type: String,
        default: "",
      },

      utmCampaign: {
        type: String,
        default: "",
      },

      utmContent: {
        type: String,
        default: "",
      },

      utmTerm: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  },
);

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

// Frequently queried fields
analyticsSchema.index({ event: 1 });
analyticsSchema.index({ page: 1 });
analyticsSchema.index({ createdAt: -1 });

analyticsSchema.index({
  event: 1,
  createdAt: -1,
});

analyticsSchema.index({
  "visitor.country": 1,
});

analyticsSchema.index({
  "visitor.device": 1,
});

analyticsSchema.index({
  "metadata.experienceSlug": 1,
});

analyticsSchema.index({
  sessionId: 1,
  createdAt: -1,
});

analyticsSchema.index({
  visitorId: 1,
  createdAt: -1,
});

export default mongoose.model("Analytics", analyticsSchema);
