import "dotenv/config";

import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";

import Experience from "../models/Experience.js";
import experiencesData from "../data/experiencesData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================
// CONFIG
// ============================================================

const CLIENT_IMAGES_DIR = path.resolve(
  __dirname,
  "../../client/public/assets/images",
);

const MANIFEST_FILE = path.join(
  __dirname,
  "imagekit-local-migration-manifest.json",
);

const REPORT_FILE = path.join(__dirname, "experience-media-audit.json");

// ============================================================
// VALIDATION
// ============================================================

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is missing from server/.env");
}

if (!fs.existsSync(CLIENT_IMAGES_DIR)) {
  throw new Error(`Client images directory not found:\n${CLIENT_IMAGES_DIR}`);
}

// ============================================================
// HELPERS
// ============================================================

const loadManifest = () => {
  if (!fs.existsSync(MANIFEST_FILE)) {
    console.warn("[Audit] ImageKit migration manifest not found.");

    return {
      generatedAt: null,
      files: {},
    };
  }

  try {
    return JSON.parse(fs.readFileSync(MANIFEST_FILE, "utf8"));
  } catch (error) {
    throw new Error(`Unable to read migration manifest: ${error.message}`);
  }
};

const isHttpUrl = (value = "") => /^https?:\/\//i.test(String(value));

const isCloudinaryUrl = (value = "") =>
  String(value).includes("res.cloudinary.com");

const isImageKitUrl = (value = "") => String(value).includes("ik.imagekit.io");

const classifyMediaValue = (value = "") => {
  const stringValue = String(value || "").trim();

  if (!stringValue) {
    return "empty";
  }

  if (isImageKitUrl(stringValue)) {
    return "imagekit-url";
  }

  if (isCloudinaryUrl(stringValue)) {
    return "cloudinary-url";
  }

  if (isHttpUrl(stringValue)) {
    return "other-url";
  }

  return "cloudinary-public-id-or-other";
};

const isImageFile = (fileName) =>
  /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(fileName);

const naturalSort = (a, b) =>
  a.localeCompare(b, undefined, {
    numeric: true,
    sensitivity: "base",
  });

const safeName = (value) =>
  String(value)
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

// ============================================================
// LOCAL SOURCE DISCOVERY
// ============================================================

const getLocalSource = (slug) => {
  const folderMappings = {
    "fisayo-folabi": "ff",
    "obi-dina": "od",
    "neye-rotimi": "nr",
    "dara-tosin": "dt",
    "foa-80": "foa",
    "owambe-30": "ow",
    maggi: "mg",
    lala: "lala",
    "niyi-40": "niyi",
  };

  const individualMappings = {
    kai: ["kai.jpeg"],
    "shea-moisture": ["shea-moisture.jpg"],
  };

  if (folderMappings[slug]) {
    const folderPath = path.join(CLIENT_IMAGES_DIR, folderMappings[slug]);

    if (!fs.existsSync(folderPath)) {
      return {
        type: "folder",
        path: folderMappings[slug],
        exists: false,
        files: [],
      };
    }

    const files = fs
      .readdirSync(folderPath)
      .filter(isImageFile)
      .sort(naturalSort);

    return {
      type: "folder",
      path: folderMappings[slug],
      exists: true,
      files,
    };
  }

  if (individualMappings[slug]) {
    const files = individualMappings[slug].filter((fileName) =>
      fs.existsSync(path.join(CLIENT_IMAGES_DIR, fileName)),
    );

    return {
      type: "files",
      path: null,
      exists: files.length > 0,
      files,
    };
  }

  return {
    type: "unmapped",
    path: null,
    exists: false,
    files: [],
  };
};

// ============================================================
// MANIFEST DISCOVERY
// ============================================================

const getManifestFiles = (manifest, slug) => {
  const experienceFiles = manifest.files?.[slug] || {};

  return Object.entries(experienceFiles).map(([localPath, data]) => ({
    localPath,
    ...data,
  }));
};

// ============================================================
// REFERENCE ANALYSIS
// ============================================================

const analyseReferences = (references = []) => {
  const analysis = {
    total: references.length,

    imageKitUrls: 0,
    cloudinaryUrls: 0,
    otherUrls: 0,
    bareIds: 0,
    empty: 0,

    values: [],
  };

  for (let index = 0; index < references.length; index += 1) {
    const value = references[index];

    const type = classifyMediaValue(value);

    if (type === "imagekit-url") {
      analysis.imageKitUrls += 1;
    } else if (type === "cloudinary-url") {
      analysis.cloudinaryUrls += 1;
    } else if (type === "other-url") {
      analysis.otherUrls += 1;
    } else if (type === "cloudinary-public-id-or-other") {
      analysis.bareIds += 1;
    } else {
      analysis.empty += 1;
    }

    analysis.values.push({
      index: index + 1,
      value,
      type,
    });
  }

  return analysis;
};

// ============================================================
// MAIN
// ============================================================

const runAudit = async () => {
  console.log("\n====================================================");

  console.log("Coker Creative — Experience Media Audit");

  console.log("READ ONLY — MongoDB WILL NOT BE MODIFIED");

  console.log("====================================================\n");

  const manifest = loadManifest();

  await mongoose.connect(process.env.MONGO_URI);

  console.log("[Audit] MongoDB connected.");

  const databaseExperiences = await Experience.find().sort({
    createdAt: 1,
  });

  console.log(
    `[Audit] Found ${databaseExperiences.length} database experiences.\n`,
  );

  const report = {
    generatedAt: new Date().toISOString(),

    databaseExperienceCount: databaseExperiences.length,

    summary: {
      fullyImageKit: 0,
      partiallyImageKit: 0,
      stillCloudinary: 0,
      noRecoveredLocalMedia: 0,
      unmappedExperiences: 0,
    },

    experiences: [],
  };

  for (const experience of databaseExperiences) {
    const slug = experience.slug;

    console.log("\n----------------------------------------------------");

    console.log(`${experience.title} (${slug})`);

    // --------------------------------------------------------
    // DATABASE
    // --------------------------------------------------------

    const heroImages = Array.isArray(experience.heroImages)
      ? experience.heroImages
      : [];

    const gallery = Array.isArray(experience.gallery) ? experience.gallery : [];

    const heroAnalysis = analyseReferences(heroImages);

    const galleryAnalysis = analyseReferences(gallery);

    // --------------------------------------------------------
    // STATIC SOURCE DATA
    // --------------------------------------------------------

    const staticData = experiencesData[slug] || null;

    const staticHeroCount = staticData?.heroImages?.length || 0;

    const staticGalleryCount = staticData?.gallery?.length || 0;

    // --------------------------------------------------------
    // LOCAL FILES
    // --------------------------------------------------------

    const localSource = getLocalSource(slug);

    // --------------------------------------------------------
    // IMAGEKIT MANIFEST
    // --------------------------------------------------------

    const manifestFiles = getManifestFiles(manifest, slug);

    const uploadedManifestFiles = manifestFiles.filter(
      (file) => file.status === "uploaded" && file.url,
    );

    // --------------------------------------------------------
    // STATUS
    // --------------------------------------------------------

    const totalDatabaseImages = heroImages.length + gallery.length;

    const databaseImageKitImages =
      heroAnalysis.imageKitUrls + galleryAnalysis.imageKitUrls;

    const databaseCloudinaryImages =
      heroAnalysis.cloudinaryUrls +
      heroAnalysis.bareIds +
      galleryAnalysis.cloudinaryUrls +
      galleryAnalysis.bareIds;

    let status = "needs-review";

    if (
      totalDatabaseImages > 0 &&
      databaseImageKitImages === totalDatabaseImages
    ) {
      status = "fully-imagekit";
      report.summary.fullyImageKit += 1;
    } else if (databaseImageKitImages > 0) {
      status = "partially-imagekit";
      report.summary.partiallyImageKit += 1;
    } else if (databaseCloudinaryImages > 0) {
      status = "still-cloudinary";
      report.summary.stillCloudinary += 1;
    }

    if (localSource.type === "unmapped" || localSource.files.length === 0) {
      report.summary.noRecoveredLocalMedia += 1;
    }

    if (localSource.type === "unmapped") {
      report.summary.unmappedExperiences += 1;
    }

    // --------------------------------------------------------
    // DISPLAY
    // --------------------------------------------------------

    console.log(`Database hero images: ${heroImages.length}`);

    console.log(`Database gallery images: ${gallery.length}`);

    console.log(`Static hero references: ${staticHeroCount}`);

    console.log(`Static gallery references: ${staticGalleryCount}`);

    console.log(`Database ImageKit references: ${databaseImageKitImages}`);

    console.log(
      `Database Cloudinary/legacy references: ${databaseCloudinaryImages}`,
    );

    console.log(`Recovered local files: ${localSource.files.length}`);

    console.log(`ImageKit manifest files: ${uploadedManifestFiles.length}`);

    console.log(`Status: ${status}`);

    // --------------------------------------------------------
    // PUSH REPORT
    // --------------------------------------------------------

    report.experiences.push({
      id: experience._id?.toString(),

      slug,

      title: experience.title,

      category: experience.category,

      status,

      database: {
        hero: heroAnalysis,

        gallery: galleryAnalysis,

        featuredVideo: experience.featuredVideo || "",
      },

      staticSource: {
        exists: Boolean(staticData),

        heroCount: staticHeroCount,

        galleryCount: staticGalleryCount,
      },

      recoveredLocalMedia: {
        type: localSource.type,

        path: localSource.path,

        exists: localSource.exists,

        files: localSource.files,
      },

      imageKitManifest: {
        uploadedCount: uploadedManifestFiles.length,

        files: uploadedManifestFiles,
      },

      migrationAssessment: {
        databaseImageCount: totalDatabaseImages,

        databaseImageKitCount: databaseImageKitImages,

        databaseLegacyCount: databaseCloudinaryImages,

        recoveredLocalCount: localSource.files.length,

        recoveredImageKitCount: uploadedManifestFiles.length,

        localMediaAppearsComplete:
          localSource.files.length >= totalDatabaseImages,

        // IMPORTANT:
        // This is only a count comparison.
        // It does NOT claim the files correspond
        // to specific old Cloudinary references.
        exactMappingConfirmed: false,
      },
    });
  }

  // ==========================================================
  // SAVE REPORT
  // ==========================================================

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));

  // ==========================================================
  // SUMMARY
  // ==========================================================

  console.log("\n====================================================");

  console.log("Experience media audit complete");

  console.log("====================================================");

  console.log(`Fully ImageKit: ${report.summary.fullyImageKit}`);

  console.log(`Partially ImageKit: ${report.summary.partiallyImageKit}`);

  console.log(`Still Cloudinary / legacy: ${report.summary.stillCloudinary}`);

  console.log(
    `No recovered local media: ${report.summary.noRecoveredLocalMedia}`,
  );

  console.log(`Unmapped experiences: ${report.summary.unmappedExperiences}`);

  console.log(`Report: ${REPORT_FILE}`);

  console.log("\n⚠️ MongoDB was NOT modified.");

  await mongoose.disconnect();

  console.log("[Audit] MongoDB disconnected.");
};

// ============================================================
// ERROR HANDLING
// ============================================================

runAudit().catch(async (error) => {
  console.error("\n[Audit] Fatal error:");

  console.error(error?.message || error);

  try {
    await mongoose.disconnect();
  } catch {
    // Ignore disconnect error.
  }

  process.exit(1);
});
