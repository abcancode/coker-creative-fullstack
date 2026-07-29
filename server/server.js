import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";

import siteContentRoutes from "./routes/siteContentRoutes.js";

import featuredBrandRoutes from "./routes/featuredBrandRoutes.js";

import testimonialRoutes from "./routes/testimonialRoutes.js";

import recognitionRoutes from "./routes/recognitionRoutes.js";

import inquiryRoutes from "./routes/inquiryRoutes.js";

import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/experiences", experienceRoutes);

app.use("/api/site-content", siteContentRoutes);

app.use("/api/featured-brands", featuredBrandRoutes);

app.use("/api/testimonials", testimonialRoutes);

app.use("/api/recognitions", recognitionRoutes);

app.use("/api/inquiries", inquiryRoutes);

app.use("/api/analytics", analyticsRoutes);

// CONNECT DATABASE
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("❌ MONGO ERROR:", err);
  });

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    version: "b7b17a9",
    analyticsRegistered: true,
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});
