import axios from "axios";

const API = "http://127.0.0.1:8000/api/testimonials";

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
