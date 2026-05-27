import axios from "axios";

const API = "http://127.0.0.1:8000/api/featured-brands";

// GET BRANDS
export const getBrands = async () => {
  const { data } = await axios.get(API);

  return data;
};

// CREATE BRAND
export const createBrand = async (formData) => {
  const { data } = await axios.post(API, formData);

  return data;
};

// DELETE BRAND
export const deleteBrand = async (id) => {
  const { data } = await axios.delete(`${API}/${id}`);

  return data;
};
