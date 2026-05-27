import api from "./api";

// LOGIN ADMIN
export const loginAdmin = async (formData) => {
  const response = await api.post("/auth/login", formData);

  return response.data;
};

// GET PROFILE
export const getProfile = async () => {
  const response = await api.get("/auth/profile");

  return response.data;
};
