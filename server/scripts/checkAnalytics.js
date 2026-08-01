import mongoose from "mongoose";
import dotenv from "dotenv";
import Analytics from "../models/Analytics.js";

dotenv.config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ Connected to MongoDB\n");

    const latest = await Analytics.find()
      .sort({ createdAt: -1 })
      .limit(15)
      .select("event page visitor.browser visitor.device createdAt")
      .lean();

    console.table(
      latest.map((item) => ({
        event: item.event,
        page: item.page,
        browser: item.visitor?.browser,
        device: item.visitor?.device,
        createdAt: item.createdAt,
      })),
    );

    await mongoose.disconnect();

    console.log("\n✅ Done.");
  } catch (err) {
    console.error(err);
  }
}

run();
