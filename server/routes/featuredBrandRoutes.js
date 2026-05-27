import express from "express";

import {
  getBrands,
  createBrand,
  deleteBrand,
} from "../controllers/featuredBrandController.js";

const router = express.Router();

router.get("/", getBrands);

router.post("/", createBrand);

router.delete("/:id", deleteBrand);

export default router;
