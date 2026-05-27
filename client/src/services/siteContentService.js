import axios from "axios";

const API = "http://127.0.0.1:8000/api/site-content";

// GET PAGE CONTENT
export const getSiteContent = async (page) => {
  const { data } = await axios.get(`${API}/${page}`);

  return data;
};

// UPDATE PAGE CONTENT
export const updateSiteContent = async (page, formData) => {
  const { data } = await axios.put(`${API}/${page}`, formData);

  return data;
};
