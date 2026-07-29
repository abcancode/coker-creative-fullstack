import express from "express";
import {
  trackEvent,
  getDashboard,
} from "../controllers/analyticsController.js";

// Import your existing authentication middleware
// Update this path/name to match your project if needed.
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Public endpoint
 * Records analytics events from the website.
 */
router.post("/events", trackEvent);

/**
 * Protected endpoint
 * Returns dashboard analytics.
 */
router.get("/dashboard", protect, getDashboard);

export default router;
