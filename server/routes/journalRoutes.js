import express from "express";

import {
  getPosts,
  getAdminPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/journalController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Journal
|--------------------------------------------------------------------------
*/

router.get("/", getPosts);

router.get("/admin", protect, getAdminPosts);

router.get("/:slug", getPostBySlug);

/*
|--------------------------------------------------------------------------
| Admin Journal
|--------------------------------------------------------------------------
*/

router.post("/", protect, createPost);

router.put("/:id", protect, updatePost);

router.delete("/:id", protect, deletePost);

export default router;
