import Experience from "../models/Experience.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

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
        message: "No image uploaded",
      });
    }

    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "coker-creative",
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          },
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload();

    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
