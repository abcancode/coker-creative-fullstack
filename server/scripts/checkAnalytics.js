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
      .select(
        "event page visitor.browser visitor.os visitor.device visitor.language visitor.ipAddress visitor.country visitor.region visitor.city visitor.screenResolution createdAt",
      )
      .lean();

    console.table(
      latest.map((item) => ({
        event: item.event,
        page: item.page,
        browser: item.visitor?.browser,
        os: item.visitor?.os,
        device: item.visitor?.device,
        language: item.visitor?.language,
        ipAddress: item.visitor?.ipAddress,
        country: item.visitor?.country,
        region: item.visitor?.region,
        city: item.visitor?.city,
        screenResolution: item.visitor?.screenResolution,
        createdAt: item.createdAt,
      })),
    );

    await mongoose.disconnect();

    console.log("\n✅ Done.");
  } catch (err) {
    console.error("❌ Analytics check failed:", err);
    process.exitCode = 1;
  }
}

run();
