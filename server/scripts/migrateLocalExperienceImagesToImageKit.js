import "dotenv/config";

import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import ImageKit from "@imagekit/nodejs";
import { fileURLToPath } from "url";

import Experience from "../models/Experience.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================
// CONFIG
// ============================================================

const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;
const IMAGEKIT_URL_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT;

const CLIENT_IMAGES_DIR = path.resolve(
  __dirname,
  "../../client/public/assets/images",
);

const MANIFEST_FILE = path.join(
  __dirname,
  "imagekit-local-migration-manifest.json",
);

if (!IMAGEKIT_PRIVATE_KEY) {
  throw new Error("IMAGEKIT_PRIVATE_KEY is missing from server/.env");
}

if (!IMAGEKIT_URL_ENDPOINT) {
  throw new Error("IMAGEKIT_URL_ENDPOINT is missing from server/.env");
}

if (!fs.existsSync(CLIENT_IMAGES_DIR)) {
  throw new Error(`Client images directory not found:\n${CLIENT_IMAGES_DIR}`);
}

const imageKit = new ImageKit({
  privateKey: IMAGEKIT_PRIVATE_KEY,
});

// ============================================================
// EXPERIENCE → LOCAL MEDIA SOURCES
// ============================================================

const EXPERIENCE_SOURCES = {
  "fisayo-folabi": {
    type: "folder",
    path: "ff",
  },

  "obi-dina": {
    type: "folder",
    path: "od",
  },

  "neye-rotimi": {
    type: "folder",
    path: "nr",
  },

  "dara-tosin": {
    type: "folder",
    path: "dt",
  },

  "foa-80": {
    type: "folder",
    path: "foa",
  },

  "owambe-30": {
    type: "folder",
    path: "ow",
  },

  maggi: {
    type: "folder",
    path: "mg",
  },

  lala: {
    type: "folder",
    path: "lala",
  },

  "niyi-40": {
    type: "folder",
    path: "niyi",
  },

  kai: {
    type: "files",
    files: ["kai.jpeg"],
  },

  "shea-moisture": {
    type: "files",
    files: ["shea-moisture.jpg"],
  },
};

// ============================================================
// HELPERS
// ============================================================

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

const loadManifest = () => {
  if (!fs.existsSync(MANIFEST_FILE)) {
    return {
      generatedAt: null,
      files: {},
    };
  }

  try {
    return JSON.parse(fs.readFileSync(MANIFEST_FILE, "utf8"));
  } catch {
    console.warn(
      "[Migration] Existing manifest could not be parsed. Starting fresh.",
    );

    return {
      generatedAt: null,
      files: {},
    };
  }
};

const saveManifest = (manifest) => {
  manifest.generatedAt = new Date().toISOString();

  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
};

// ============================================================
// MAIN
// ============================================================

const run = async () => {
  console.log("\n====================================================");

  console.log("Coker Creative — Local Experience Image Migration");

  console.log("Local files → ImageKit");

  console.log("====================================================\n");

  await mongoose.connect(process.env.MONGO_URI);

  console.log("[Migration] MongoDB connected.");

  const experiences = await Experience.find().sort({
    createdAt: 1,
  });

  console.log(
    `[Migration] Found ${experiences.length} database experiences.\n`,
  );

  const manifest = loadManifest();

  let uploaded = 0;
  let skipped = 0;
  let missingSources = 0;
  let failed = 0;

  for (const experience of experiences) {
    const slug = experience.slug;

    console.log("\n----------------------------------------------------");

    console.log(`${experience.title} (${slug})`);

    const source = EXPERIENCE_SOURCES[slug];

    if (!source) {
      console.log("⚠️  No confident local media mapping. Skipping.");

      missingSources += 1;

      continue;
    }

    // --------------------------------------------------------
    // BUILD LOCAL FILE LIST
    // --------------------------------------------------------

    let files = [];
    let filePaths = [];

    // --------------------------------------------------------
    // FOLDER-BASED SOURCE
    // --------------------------------------------------------

    if (source.type === "folder") {
      const localFolder = path.join(CLIENT_IMAGES_DIR, source.path);

      if (!fs.existsSync(localFolder)) {
        console.log(`⚠️  Local folder does not exist: ${source.path}`);

        missingSources += 1;

        continue;
      }

      files = fs.readdirSync(localFolder).filter(isImageFile).sort(naturalSort);

      filePaths = files.map((fileName) => path.join(localFolder, fileName));
    }

    // --------------------------------------------------------
    // INDIVIDUAL FILE SOURCE
    // --------------------------------------------------------

    if (source.type === "files") {
      files = source.files.filter((fileName) => {
        const candidatePath = path.join(CLIENT_IMAGES_DIR, fileName);

        return fs.existsSync(candidatePath) && isImageFile(fileName);
      });

      filePaths = files.map((fileName) =>
        path.join(CLIENT_IMAGES_DIR, fileName),
      );
    }

    console.log(`Local images found: ${files.length}`);

    if (!files.length) {
      console.log("⚠️  No local image files found. Skipping.");

      missingSources += 1;

      continue;
    }

    // --------------------------------------------------------
    // INITIALIZE MANIFEST ENTRY
    // --------------------------------------------------------

    if (!manifest.files[slug]) {
      manifest.files[slug] = {};
    }

    // --------------------------------------------------------
    // PROCESS FILES
    // --------------------------------------------------------

    for (let index = 0; index < files.length; index += 1) {
      const fileName = files[index];

      // IMPORTANT:
      // filePath must be declared BEFORE it is used.
      const filePath = filePaths[index];

      if (!filePath) {
        console.error(`❌ No file path found for ${fileName}`);

        failed += 1;

        continue;
      }

      const localRelativePath = path
        .relative(CLIENT_IMAGES_DIR, filePath)
        .replace(/\\/g, "/");

      // ------------------------------------------------------
      // ALREADY MIGRATED?
      // ------------------------------------------------------

      if (manifest.files[slug][localRelativePath]?.url) {
        console.log(`↪️  Already migrated: ${localRelativePath}`);

        skipped += 1;

        continue;
      }

      // ------------------------------------------------------
      // FILE SIZE CHECK
      // ------------------------------------------------------

      const stats = fs.statSync(filePath);

      // ImageKit Free plan image upload limit.
      if (stats.size > 25 * 1024 * 1024) {
        console.log(`❌ ${fileName} exceeds 25MB. Skipping.`);

        failed += 1;

        manifest.files[slug][localRelativePath] = {
          localPath: localRelativePath,
          status: "failed",
          reason: "exceeds-25mb",
        };

        saveManifest(manifest);

        continue;
      }

      // ------------------------------------------------------
      // IMAGEKIT DESTINATION
      // ------------------------------------------------------

      const imageKitFolder = `/coker-creative/experiences/${safeName(slug)}`;

      const fileNameSafe = safeName(fileName);

      console.log(`⬆️  Uploading ${localRelativePath}`);

      // ------------------------------------------------------
      // UPLOAD
      // ------------------------------------------------------

      try {
        const fileStream = fs.createReadStream(filePath);

        const result = await imageKit.files.upload({
          file: fileStream,

          fileName: fileNameSafe,

          folder: imageKitFolder,

          useUniqueFileName: false,

          overwriteFile: false,
        });

        if (!result?.url) {
          throw new Error("ImageKit did not return a URL.");
        }

        // ----------------------------------------------------
        // SAVE RESULT TO MANIFEST
        // ----------------------------------------------------

        manifest.files[slug][localRelativePath] = {
          localPath: localRelativePath,

          url: result.url,

          fileId: result.fileId || "",

          filePath: result.filePath || "",

          fileName: result.name || fileNameSafe,

          status: "uploaded",
        };

        uploaded += 1;

        console.log(`✅ ${result.url}`);
      } catch (error) {
        failed += 1;

        manifest.files[slug][localRelativePath] = {
          localPath: localRelativePath,

          status: "failed",

          reason: error?.message || "Unknown ImageKit error",
        };

        console.error(`❌ Failed: ${fileName}`);

        console.error(error?.message || error);
      }

      // Save after EVERY file so that an interrupted
      // migration can safely resume.
      saveManifest(manifest);
    }
  }

  // ----------------------------------------------------------
  // FINAL MANIFEST SAVE
  // ----------------------------------------------------------

  saveManifest(manifest);

  // ----------------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------------

  console.log("\n====================================================");

  console.log("Migration inventory complete");

  console.log("====================================================");

  console.log(`Uploaded: ${uploaded}`);

  console.log(`Already uploaded: ${skipped}`);

  console.log(`Missing/unmapped sources: ${missingSources}`);

  console.log(`Failed: ${failed}`);

  console.log(`Manifest: ${MANIFEST_FILE}`);

  console.log("\n⚠️ MongoDB was NOT modified.");

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
