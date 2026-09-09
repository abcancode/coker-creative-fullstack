import express from "express";

import { getImageKitAuth } from "../controllers/mediaController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/imagekit-auth", protect, getImageKitAuth);

export default router;
