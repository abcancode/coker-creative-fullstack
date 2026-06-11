import axios from "axios";

const API = "https://coker-creative-fullstack.onrender.com/api/featured-brands";

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
