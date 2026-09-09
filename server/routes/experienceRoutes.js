import express from "express";

import {
  createExperience,
  getExperiences,
  getExperience,
  updateExperience,
  deleteExperience,
  uploadExperienceImage,
} from "../controllers/experienceController.js";

import experienceUpload from "../middleware/experienceUploadMiddleware.js";

const router = express.Router();

// IMAGE UPLOAD
router.post("/upload", experienceUpload.single("image"), uploadExperienceImage);

// CREATE
router.post("/", createExperience);

// GET ALL
router.get("/", getExperiences);

// GET SINGLE
router.get("/:id", getExperience);

// UPDATE
router.put("/:id", updateExperience);

// DELETE
router.delete("/:id", deleteExperience);

export default router;
