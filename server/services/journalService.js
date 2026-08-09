import JournalPost from "../models/JournalPost.js";

/**
 * Generate a URL-safe slug from a title.
 */
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

/**
 * Ensure the slug is unique.
 */
const ensureUniqueSlug = async (title, existingId = null) => {
  const baseSlug = generateSlug(title);

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query = {
      slug,
    };

    if (existingId) {
      query._id = { $ne: existingId };
    }

    const existingPost = await JournalPost.findOne(query);

    if (!existingPost) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
};

/**
 * Get published journal posts.
 */
export const getPublishedPosts = async () => {
  return JournalPost.find({
    status: "published",
    publishedAt: { $ne: null },
  })
    .sort({ publishedAt: -1 })
    .lean();
};

/**
 * Get a published journal post by slug.
 */
export const getPublishedPostBySlug = async (slug) => {
  return JournalPost.findOne({
    slug,
    status: "published",
    publishedAt: { $ne: null },
  }).lean();
};

/**
 * Get all posts for the admin dashboard.
 */
export const getAllPosts = async () => {
  return JournalPost.find().sort({ createdAt: -1 }).lean();
};

/**
 * Get a single post by ID.
 */
export const getPostById = async (id) => {
  return JournalPost.findById(id).lean();
};

/**
 * Create a journal post.
 */
export const createPost = async (payload) => {
  const slug = await ensureUniqueSlug(payload.title);

  const isPublished = payload.status === "published";

  const post = await JournalPost.create({
    ...payload,

    slug,

    publishedAt: isPublished ? payload.publishedAt || new Date() : null,
  });

  return post;
};

/**
 * Update a journal post.
 */
export const updatePost = async (id, payload) => {
  const existingPost = await JournalPost.findById(id);

  if (!existingPost) {
    throw new Error("Journal post not found.");
  }

  let slug = existingPost.slug;

  // Regenerate slug only when title changes.
  if (payload.title && payload.title !== existingPost.title) {
    slug = await ensureUniqueSlug(payload.title, id);
  }

  const isPublished = payload.status === "published";

  let publishedAt = existingPost.publishedAt;

  if (isPublished && !publishedAt) {
    publishedAt = new Date();
  }

  if (!isPublished) {
    publishedAt = null;
  }

  Object.assign(existingPost, {
    ...payload,
    slug,
    publishedAt,
  });

  await existingPost.save();

  return existingPost;
};

/**
 * Delete a journal post.
 */
export const deletePost = async (id) => {
  const post = await JournalPost.findById(id);

  if (!post) {
    throw new Error("Journal post not found.");
  }

  await post.deleteOne();

  return {
    message: "Journal post deleted successfully.",
  };
};
