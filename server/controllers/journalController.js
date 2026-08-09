import * as journalService from "../services/journalService.js";

/**
 * GET /api/journal
 *
 * Public:
 * Return published journal posts only.
 */
export const getPosts = async (req, res) => {
  try {
    const posts = await journalService.getPublishedPosts();

    return res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("[Journal] getPosts:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve journal posts.",
    });
  }
};

/**
 * GET /api/journal/admin
 *
 * Admin only:
 * Return all journal posts.
 */
export const getAdminPosts = async (req, res) => {
  try {
    const posts = await journalService.getAllPosts();

    return res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("[Journal] getAdminPosts:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve journal posts.",
    });
  }
};

/**
 * GET /api/journal/:slug
 *
 * Public:
 * Return one published journal post.
 */
export const getPostBySlug = async (req, res) => {
  try {
    const post = await journalService.getPublishedPostBySlug(req.params.slug);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Journal post not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("[Journal] getPostBySlug:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve journal post.",
    });
  }
};

/**
 * POST /api/journal
 *
 * Admin only.
 */
export const createPost = async (req, res) => {
  try {
    const post = await journalService.createPost(req.body);

    return res.status(201).json({
      success: true,
      message: "Journal post created successfully.",
      data: post,
    });
  } catch (error) {
    console.error("[Journal] createPost:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Unable to create journal post.",
    });
  }
};

/**
 * PUT /api/journal/:id
 *
 * Admin only.
 */
export const updatePost = async (req, res) => {
  try {
    const post = await journalService.updatePost(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Journal post updated successfully.",
      data: post,
    });
  } catch (error) {
    console.error("[Journal] updatePost:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Unable to update journal post.",
    });
  }
};

/**
 * DELETE /api/journal/:id
 *
 * Admin only.
 */
export const deletePost = async (req, res) => {
  try {
    const result = await journalService.deletePost(req.params.id);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("[Journal] deletePost:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Unable to delete journal post.",
    });
  }
};
