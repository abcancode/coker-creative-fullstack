import express from "express";

import {
  getRecognitions,
  createRecognition,
  deleteRecognition,
} from "../controllers/recognitionController.js";

const router = express.Router();

router.get("/", getRecognitions);

router.post("/", createRecognition);

router.delete("/:id", deleteRecognition);

export default router;
