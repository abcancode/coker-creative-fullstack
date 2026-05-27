import api from "./api";

// GET ALL EXPERIENCES
export const getExperiences = async () => {
  const response = await api.get("/experiences");

  return response.data;
};

// GET SINGLE EXPERIENCE
export const getExperience = async (id) => {
  const response = await api.get(`/experiences/${id}`);

  return response.data;
};

// CREATE EXPERIENCE
export const createExperience = async (formData) => {
  const response = await api.post("/experiences", formData);

  return response.data;
};

// UPDATE EXPERIENCE
export const updateExperience = async (id, formData) => {
  const response = await api.put(`/experiences/${id}`, formData);

  return response.data;
};

// DELETE EXPERIENCE
export const deleteExperience = async (id) => {
  const response = await api.delete(`/experiences/${id}`);

  return response.data;
};

// UPLOAD IMAGE
export const uploadExperienceImage = async (imageData) => {
  const response = await api.post("/experiences/upload", imageData);

  return response.data;
};
