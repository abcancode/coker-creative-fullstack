import mongoose from "mongoose";

const siteContentSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      unique: true,
    },

    heroTitle: String,

    heroVideo: String,

    heroPoster: String,

    primaryButtonText: String,

    primaryButtonLink: String,

    secondaryButtonText: String,

    secondaryButtonLink: String,

    // ============================================================
    // SEO
    // ============================================================

    seoTitle: String,

    seoDescription: String,

    seoImage: String,

    // ============================================================
    // HOME
    // ============================================================

    whatWeDoTitle: String,

    whatWeDoDescription: String,

    visualTransitionImage: String,

    visualTransitionTitle: String,

    visualTransitionText: String,

    footerTitleLine1: String,

    footerTitleLine2: String,

    footerTitleLine3: String,

    footerButtonText: String,

    footerButtonLink: String,

    footerInstagram: String,

    footerFacebook: String,

    footerTwitter: String,

    footerEmail: String,

    footerHandle: String,

    footerLocations: String,

    footerCopyright: String,

    // ============================================================
    // WHO WE ARE
    // ============================================================

    whoHeroTitle: String,

    whoHeroImages: [String],

    whoSeoTitle: String,

    whoSeoDescription: String,

    ourStoryTitle: String,

    ourStoryParagraph1: String,

    ourStoryParagraph2: String,

    ourStoryImages: [String],

    coreValuesTitle: String,

    coreValuesDescription: String,

    coreValueOne: String,

    coreValueTwo: String,

    coreValueThree: String,

    visionaryTitle: String,

    visionaryDescription: String,

    visionaryName: String,

    visionaryRole: String,

    visionaryImage: String,

    // ============================================================
    // VISUAL TRANSITION
    // ============================================================

    visualTransitionImages: {
      type: [String],
      default: [],
    },

    // ============================================================
    // START YOUR EXPERIENCE
    // ============================================================

    startExperienceTitle: String,

    startExperienceSubtitle: String,

    startExperienceImages: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const SiteContent = mongoose.model("SiteContent", siteContentSchema);

export default SiteContent;
