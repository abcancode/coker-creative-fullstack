import api from "./api";

/**
 * Get all journal posts for the admin dashboard.
 */
export const getAdminPosts = async () => {
  const { data } = await api.get("/journal?admin=true");

  return data.data;
};

/**
 * Get a published journal post by slug.
 */
export const getPostBySlug = async (slug) => {
  const { data } = await api.get(`/journal/${slug}`);

  return data.data;
};

/**
 * Create a journal post.
 */
export const createPost = async (payload) => {
  const { data } = await api.post("/journal", payload);

  return data.data;
};

/**
 * Update a journal post.
 */
export const updatePost = async (id, payload) => {
  const { data } = await api.put(`/journal/${id}`, payload);

  return data.data;
};

/**
 * Delete a journal post.
 */
export const deletePost = async (id) => {
  const { data } = await api.delete(`/journal/${id}`);

  return data;
};
