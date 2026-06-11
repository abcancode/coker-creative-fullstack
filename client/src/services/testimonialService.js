import axios from "axios";

const API = "https://coker-creative-fullstack.onrender.com/api/testimonials";

// GET
export const getTestimonials = async () => {
  const { data } = await axios.get(API);

  return data;
};

// CREATE
export const createTestimonial = async (formData) => {
  const { data } = await axios.post(API, formData);

  return data;
};

// DELETE
export const deleteTestimonial = async (id) => {
  const { data } = await axios.delete(`${API}/${id}`);

  return data;
};
