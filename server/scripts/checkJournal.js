import mongoose from "mongoose";
import dotenv from "dotenv";
import JournalPost from "../models/JournalPost.js";

dotenv.config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ Connected to MongoDB");
    console.log("Database:", mongoose.connection.name);

    const posts = await JournalPost.find()
      .sort({ createdAt: -1 })
      .select("title status slug publishedAt createdAt")
      .lean();

    console.table(posts);

    await mongoose.disconnect();

    console.log("\n✅ Done.");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exitCode = 1;
  }
}

run();
