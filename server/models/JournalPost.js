import mongoose from "mongoose";

const journalPostSchema = new mongoose.Schema(
  {
    // --------------------------------------------------
    // Core Content
    // --------------------------------------------------

    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    excerpt: {
      type: String,
      default: "",
      trim: true,
    },

    content: {
      type: String,
      required: true,
      default: "",
    },

    // --------------------------------------------------
    // Classification
    // --------------------------------------------------

    category: {
      type: String,
      enum: [
        "Event Stories",
        "Awards",
        "Features",
        "News",
        "Behind the Scenes",
        "Insights",
      ],
      default: "Event Stories",
      index: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    // --------------------------------------------------
    // Featured Image
    // --------------------------------------------------

    featuredImage: {
      url: {
        type: String,
        default: "",
      },

      publicId: {
        type: String,
        default: "",
      },

      alt: {
        type: String,
        default: "",
      },
    },

    // --------------------------------------------------
    // Publishing
    // --------------------------------------------------

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },

    publishedAt: {
      type: Date,
      default: null,
      index: true,
    },

    authorName: {
      type: String,
      default: "Coker Creative",
      trim: true,
    },

    // --------------------------------------------------
    // Related Experience
    // --------------------------------------------------

    relatedExperienceSlug: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },

    // --------------------------------------------------
    // SEO
    // --------------------------------------------------

    seo: {
      title: {
        type: String,
        default: "",
        trim: true,
      },

      description: {
        type: String,
        default: "",
        trim: true,
      },

      image: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  },
);

// --------------------------------------------------
// Indexes
// --------------------------------------------------

journalPostSchema.index({
  status: 1,
  publishedAt: -1,
});

journalPostSchema.index({
  category: 1,
  status: 1,
  publishedAt: -1,
});

export default mongoose.model("JournalPost", journalPostSchema);
