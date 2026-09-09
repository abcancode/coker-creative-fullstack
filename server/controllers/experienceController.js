import fs from "fs";
import Experience from "../models/Experience.js";
import imageKit from "../config/imagekit.js";

// CREATE EXPERIENCE
export const createExperience = async (req, res) => {
  try {
    const experience = await Experience.create(req.body);

    res.status(201).json({
      message: "Experience created successfully",
      experience,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL EXPERIENCES
export const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({
      createdAt: 1,
    });

    res.status(200).json(experiences);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE EXPERIENCE
export const getExperience = async (req, res) => {
  try {
    let experience;

    // CHECK IF PARAM IS MONGODB ID
    if (req.params.id.length === 24) {
      experience = await Experience.findById(req.params.id);
    } else {
      // OTHERWISE USE SLUG
      experience = await Experience.findOne({
        slug: req.params.id,
      });
    }

    if (!experience) {
      return res.status(404).json({
        message: "Experience not found",
      });
    }

    res.status(200).json(experience);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE EXPERIENCE
export const updateExperience = async (req, res) => {
  try {
    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );

    res.status(200).json({
      message: "Experience updated successfully",
      experience,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE EXPERIENCE
export const deleteExperience = async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Experience deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPLOAD EXPERIENCE IMAGE
export const uploadExperienceImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image file received",
      });
    }

    console.log("[Experience Upload] File received:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
    });

    console.log(
      "[Experience Upload] IMAGEKIT_PRIVATE_KEY exists:",
      !!process.env.IMAGEKIT_PRIVATE_KEY,
    );

    const result = await imageKit.files.upload(
      {
        file: fs.createReadStream(req.file.path),
        fileName: req.file.originalname,
        folder: "/coker-creative/experiences",
        useUniqueFileName: true,
      },
      {
        maxRetries: 0,
        timeout: 30000,
      },
    );

    console.log("[Experience Upload] ImageKit upload successful:", {
      url: result.url,
      fileId: result.fileId,
      filePath: result.filePath,
    });

    return res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: result.url,
      fileId: result.fileId || "",
      filePath: result.filePath || "",
    });
  } catch (error) {
    console.error("[Experience Upload] ERROR:", error);

    return res.status(500).json({
      message: error.message || "Image upload failed",
    });
  } finally {
    if (req.file?.path) {
      fs.promises.unlink(req.file.path).catch(() => {});
    }
  }
};
