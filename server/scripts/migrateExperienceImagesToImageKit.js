import "dotenv/config";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ImageKit from "@imagekit/nodejs";

import Experience from "../models/Experience.js";

const TEST_ONLY = true;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;

const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;

const IMAGEKIT_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY;

const IMAGEKIT_URL_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT;

if (!CLOUDINARY_CLOUD_NAME) {
  throw new Error("CLOUDINARY_CLOUD_NAME is missing from server/.env");
}

if (!IMAGEKIT_PRIVATE_KEY) {
  throw new Error("IMAGEKIT_PRIVATE_KEY is missing from server/.env");
}

if (!IMAGEKIT_PUBLIC_KEY) {
  throw new Error("IMAGEKIT_PUBLIC_KEY is missing from server/.env");
}

if (!IMAGEKIT_URL_ENDPOINT) {
  throw new Error("IMAGEKIT_URL_ENDPOINT is missing from server/.env");
}

const imageKit = new ImageKit({
  privateKey: IMAGEKIT_PRIVATE_KEY,
});

const mappingFile = path.join(__dirname, "imagekit-migration-map.json");

let migrationMap = {};

if (fs.existsSync(mappingFile)) {
  try {
    migrationMap = JSON.parse(fs.readFileSync(mappingFile, "utf8"));
  } catch {
    console.warn(
      "[Migration] Could not read existing mapping file. Starting fresh.",
    );
  }
}

const saveMapping = () => {
  fs.writeFileSync(mappingFile, JSON.stringify(migrationMap, null, 2));
};

const isImageKitUrl = (value = "") =>
  String(value).startsWith(IMAGEKIT_URL_ENDPOINT);

const isHttpUrl = (value = "") => /^https?:\/\//i.test(String(value));

const buildCloudinaryUrl = (value) => {
  const stringValue = String(value || "").trim();

  if (!stringValue) return "";

  if (isHttpUrl(stringValue)) {
    return stringValue;
  }

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${stringValue}`;
};

const sanitizeFileName = (value) =>
  String(value || "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const getExtension = (value) => {
  const cleanValue = String(value || "").split("?")[0];
  const match = cleanValue.match(/\.(jpg|jpeg|png|webp|avif|gif)$/i);

  return match ? match[1].toLowerCase() : "";
};

const uploadExistingImage = async ({
  sourceValue,
  experience,
  type,
  index,
}) => {
  const originalValue = String(sourceValue || "").trim();

  if (!originalValue) {
    return "";
  }

  // Already migrated.
  if (isImageKitUrl(originalValue)) {
    return originalValue;
  }

  // Reuse previous migration result.
  if (migrationMap[originalValue]) {
    return migrationMap[originalValue];
  }

  const sourceUrl = buildCloudinaryUrl(originalValue);

  if (!sourceUrl) {
    return "";
  }

  const extension = getExtension(originalValue) || "jpg";

  const baseName = sanitizeFileName(experience.slug || experience._id);

  const fileName = `${baseName}-${type}-${index + 1}.${extension}`;

  const folder = `/coker-creative/experiences/${sanitizeFileName(
    experience.slug || experience._id,
  )}`;

  console.log(
    `[Migration] Uploading ${experience.slug} → ${type} ${index + 1}`,
  );

  console.log(`[Migration] Source: ${sourceUrl}`);

  try {
    const result = await imageKit.files.upload({
      file: sourceUrl,
      fileName,
      folder,

      useUniqueFileName: false,
      overwriteFile: false,
    });

    if (!result?.url) {
      throw new Error("ImageKit did not return an uploaded image URL.");
    }

    migrationMap[originalValue] = result.url;

    saveMapping();

    console.log(`[Migration] ✅ ${result.url}`);

    return result.url;
  } catch (error) {
    console.error(`[Migration] ❌ Failed: ${originalValue}`);

    console.error(error?.message || error);

    return null;
  }
};

const migrateArray = async ({ experience, images, type }) => {
  const migrated = [];

  for (let index = 0; index < images.length; index += 1) {
    const value = await uploadExistingImage({
      sourceValue: images[index],
      experience,
      type,
      index,
    });

    if (value) {
      migrated.push(value);
    } else {
      // Keep the original value if migration fails.
      migrated.push(images[index]);
    }
  }

  return migrated;
};

const runMigration = async () => {
  console.log("\n==============================================");
  console.log("Coker Creative Experience Image Migration");
  console.log("Cloudinary → ImageKit");
  console.log("==============================================\n");

  await mongoose.connect(process.env.MONGO_URI);

  console.log("[Migration] MongoDB connected.");

  const experiences = await Experience.find().sort({ createdAt: 1 }).limit(1);

  console.log(`[Migration] Found ${experiences.length} experiences.\n`);

  let migratedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const experience of experiences) {
    if (TEST_ONLY && migratedCount >= 1) {
      break;
    }
    console.log(`\n--- ${experience.title} (${experience.slug}) ---`);

    const originalHeroImages = [...(experience.heroImages || [])];

    const originalGallery = [...(experience.gallery || [])];

    const migratedHeroImages = await migrateArray({
      experience,
      images: originalHeroImages,
      type: "hero",
    });

    const migratedGallery = await migrateArray({
      experience,
      images: originalGallery,
      type: "gallery",
    });

    const changed =
      JSON.stringify(originalHeroImages) !==
        JSON.stringify(migratedHeroImages) ||
      JSON.stringify(originalGallery) !== JSON.stringify(migratedGallery);

    if (changed) {
      experience.heroImages = migratedHeroImages;

      experience.gallery = migratedGallery;

      await experience.save();

      migratedCount += 1;

      console.log(`[Migration] ✅ Database updated for ${experience.slug}`);
    } else {
      skippedCount += 1;

      console.log(
        `[Migration] No database update needed for ${experience.slug}`,
      );
    }
  }

  console.log("\n==============================================");
  console.log("Migration complete");
  console.log("==============================================");

  console.log(`Experiences updated: ${migratedCount}`);

  console.log(`Experiences skipped: ${skippedCount}`);

  console.log(`Mapping file: ${mappingFile}`);

  await mongoose.disconnect();

  console.log("[Migration] MongoDB disconnected.");
};

runMigration().catch(async (error) => {
  console.error("\n[Migration] Fatal error:");

  console.error(error?.message || error);

  try {
    await mongoose.disconnect();
  } catch {
    // Ignore disconnect failure.
  }

  process.exit(1);
});
