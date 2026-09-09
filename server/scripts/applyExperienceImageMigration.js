import "dotenv/config";

import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";

import Experience from "../models/Experience.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================
// CONFIG
// ============================================================

const MANIFEST_FILE = path.join(
  __dirname,
  "imagekit-local-migration-manifest.json",
);

const BACKUP_FILE = path.join(
  __dirname,
  `experience-media-backup-${new Date()
    .toISOString()
    .replace(/[:.]/g, "-")}.json`,
);

// SAFETY SWITCH
// ------------------------------------------------------------
// false = preview only, MongoDB is NOT modified
// true  = apply ImageKit URLs to MongoDB
//
const APPLY_CHANGES = true;

// ============================================================
// RECOVERED EXPERIENCE → FEATURED IMAGE
// ============================================================
//
// These are the obvious/main images from the recovered
// local files. They become the single hero image.
//
// All other recovered images become gallery images.
//

const FEATURED_FILES = {
  "fisayo-folabi": "ff/fisayo-and-folabi.jpeg",

  "obi-dina": "od/obi-and-dina.jpg",

  "neye-rotimi": "nr/nenye-and-rotimi.jpg",

  "dara-tosin": "dt/dara-and-tosin.jpg",

  "foa-80": "foa/foa-80.jpg",

  "owambe-30": "ow/owambe-30.jpg",

  maggi: "mg/maggi.jpg",

  lala: "lala/lala.jpeg",

  "niyi-40": "niyi/niyi-40.jpg",

  kai: "kai.jpeg",

  "shea-moisture": "shea-moisture.jpg",
};

// ============================================================
// HELPERS
// ============================================================

const loadManifest = () => {
  if (!fs.existsSync(MANIFEST_FILE)) {
    throw new Error(`Migration manifest not found:\n${MANIFEST_FILE}`);
  }

  try {
    return JSON.parse(fs.readFileSync(MANIFEST_FILE, "utf8"));
  } catch (error) {
    throw new Error(`Unable to read migration manifest: ${error.message}`);
  }
};

const naturalSort = (a, b) =>
  a.localeCompare(b, undefined, {
    numeric: true,
    sensitivity: "base",
  });

const getManifestEntries = (manifest, slug) => {
  const files = manifest.files?.[slug] || {};

  return Object.entries(files)
    .filter(([, data]) => data?.status === "uploaded" && data?.url)
    .map(([localPath, data]) => ({
      localPath,
      url: data.url,
      fileId: data.fileId || "",
      fileName: data.fileName || "",
    }))
    .sort((a, b) => naturalSort(a.localPath, b.localPath));
};

// ============================================================
// MAIN
// ============================================================

const run = async () => {
  console.log("\n====================================================");

  console.log("Coker Creative — Apply Experience Image Migration");

  console.log(APPLY_CHANGES ? "MODE: APPLY CHANGES" : "MODE: PREVIEW ONLY");

  console.log("====================================================\n");

  const manifest = loadManifest();

  await mongoose.connect(process.env.MONGO_URI);

  console.log("[Migration] MongoDB connected.");

  const experiences = await Experience.find().sort({
    createdAt: 1,
  });

  console.log(`[Migration] Found ${experiences.length} experiences.\n`);

  const backup = [];

  const changes = [];

  let skipped = 0;
  let ready = 0;

  for (const experience of experiences) {
    const slug = experience.slug;

    console.log("\n----------------------------------------------------");

    console.log(`${experience.title} (${slug})`);

    // --------------------------------------------------------
    // NO RECOVERED MEDIA
    // --------------------------------------------------------

    const manifestEntries = getManifestEntries(manifest, slug);

    if (manifestEntries.length === 0) {
      console.log("⚠️ No recovered ImageKit media. Leaving unchanged.");

      skipped += 1;

      continue;
    }

    // --------------------------------------------------------
    // FIND FEATURED IMAGE
    // --------------------------------------------------------

    const featuredPath = FEATURED_FILES[slug];

    const featuredEntry = manifestEntries.find(
      (entry) => entry.localPath === featuredPath,
    );

    if (!featuredEntry) {
      console.log(`⚠️ Featured image not found in manifest: ${featuredPath}`);

      console.log("Leaving this Experience unchanged.");

      skipped += 1;

      continue;
    }

    // --------------------------------------------------------
    // BUILD GALLERY
    // --------------------------------------------------------

    const galleryEntries = manifestEntries.filter(
      (entry) => entry.localPath !== featuredPath,
    );

    const newHeroImages = [featuredEntry.url];

    const newGalleryImages = galleryEntries.map((entry) => entry.url);

    // --------------------------------------------------------
    // BACKUP CURRENT DATA
    // --------------------------------------------------------

    backup.push({
      id: experience._id.toString(),

      title: experience.title,

      slug,

      heroImages: experience.heroImages || [],

      gallery: experience.gallery || [],

      featuredVideo: experience.featuredVideo || "",
    });

    // --------------------------------------------------------
    // DISPLAY PROPOSED CHANGE
    // --------------------------------------------------------

    console.log(`Current hero images: ${experience.heroImages?.length || 0}`);

    console.log(`Current gallery images: ${experience.gallery?.length || 0}`);

    console.log(`Recovered ImageKit images: ${manifestEntries.length}`);

    console.log(`New hero images: ${newHeroImages.length}`);

    console.log(`New gallery images: ${newGalleryImages.length}`);

    console.log(`Hero source: ${featuredPath}`);

    console.log("✅ Ready for migration");

    changes.push({
      id: experience._id.toString(),

      title: experience.title,

      slug,

      heroImages: newHeroImages,

      gallery: newGalleryImages,
    });

    ready += 1;
  }

  // ==========================================================
  // SAVE BACKUP
  // ==========================================================

  fs.writeFileSync(BACKUP_FILE, JSON.stringify(backup, null, 2));

  console.log(`\n[Migration] Backup saved to:`);

  console.log(BACKUP_FILE);

  // ==========================================================
  // APPLY
  // ==========================================================

  if (APPLY_CHANGES && changes.length > 0) {
    console.log("\n[Migration] Applying MongoDB changes...\n");

    for (const change of changes) {
      await Experience.findByIdAndUpdate(
        change.id,
        {
          $set: {
            heroImages: change.heroImages,

            gallery: change.gallery,
          },
        },
        {
          new: false,
        },
      );

      console.log(`✅ Updated: ${change.slug}`);
    }
  }

  // ==========================================================
  // SUMMARY
  // ==========================================================

  console.log("\n====================================================");

  console.log("Experience media migration summary");

  console.log("====================================================");

  console.log(`Ready: ${ready}`);

  console.log(`Skipped: ${skipped}`);

  console.log(`Planned database updates: ${changes.length}`);

  console.log(`Backup: ${BACKUP_FILE}`);

  if (APPLY_CHANGES) {
    console.log("\n✅ MongoDB migration completed.");
  } else {
    console.log("\n⚠️ PREVIEW ONLY — MongoDB was NOT modified.");

    console.log("Review the output above, then set APPLY_CHANGES = true.");
  }

  await mongoose.disconnect();

  console.log("[Migration] MongoDB disconnected.");
};

// ============================================================
// ERROR HANDLING
// ============================================================

run().catch(async (error) => {
  console.error("\n[Migration] Fatal error:");

  console.error(error?.message || error);

  try {
    await mongoose.disconnect();
  } catch {
    // Ignore disconnect failure.
  }

  process.exit(1);
});
