import express from "express";

import {
  getSiteContent,
  updateSiteContent,
} from "../controllers/siteContentController.js";

const router = express.Router();

// GET PAGE CONTENT
router.get("/:page", getSiteContent);

// UPDATE PAGE CONTENT
router.put("/:page", updateSiteContent);

export default router;
