import "dotenv/config";

import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import ImageKit from "@imagekit/nodejs";
import { fileURLToPath } from "url";

import SiteContent from "../models/siteContentModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================
// CONFIG
// ============================================================

const VIDEO_PATH = path.resolve(__dirname, "../assets/home-hero-video.mp4");

const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;

if (!IMAGEKIT_PRIVATE_KEY) {
  throw new Error("IMAGEKIT_PRIVATE_KEY is missing from server/.env");
}

if (!fs.existsSync(VIDEO_PATH)) {
  throw new Error(`Video file not found:\n${VIDEO_PATH}`);
}

const imageKit = new ImageKit({
  privateKey: IMAGEKIT_PRIVATE_KEY,
});

// ============================================================
// MAIN
// ============================================================

const run = async () => {
  console.log("\n====================================================");

  console.log("Coker Creative Home Hero Video Upload");

  console.log("Local MP4 → ImageKit");

  console.log("====================================================\n");

  const stats = fs.statSync(VIDEO_PATH);

  console.log(`Video: ${VIDEO_PATH}`);

  console.log(`Video size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

  // ==========================================================
  // UPLOAD TO IMAGEKIT
  // ==========================================================

  const fileStream = fs.createReadStream(VIDEO_PATH);

  console.log("\n[ImageKit] Uploading Home Hero video...");

  const result = await imageKit.files.upload({
    file: fileStream,

    fileName: "home-hero-video.mp4",

    folder: "/coker-creative/site/home",

    useUniqueFileName: false,

    overwriteFile: true,
  });

  if (!result?.url) {
    throw new Error("ImageKit did not return a video URL.");
  }

  console.log("\n✅ ImageKit upload successful:");

  console.log(result.url);

  // ==========================================================
  // UPDATE MONGODB
  // ==========================================================

  await mongoose.connect(process.env.MONGO_URI);

  console.log("\n[MongoDB] Connected.");

  const updated = await SiteContent.findOneAndUpdate(
    {
      page: "home",
    },
    {
      $set: {
        heroVideo: result.url,
      },
    },
    {
      new: true,
      upsert: true,
    },
  );

  console.log("\n✅ home.heroVideo updated successfully.");

  console.log(updated.heroVideo);

  await mongoose.disconnect();

  console.log("\n[MongoDB] Disconnected.");

  console.log("\n====================================================");

  console.log("Home Hero video restoration complete");

  console.log("====================================================\n");
};

run().catch(async (error) => {
  console.error("\n❌ Upload failed:");

  console.error(error?.message || error);

  try {
    await mongoose.disconnect();
  } catch {
    // Ignore disconnect failure.
  }

  process.exit(1);
});
