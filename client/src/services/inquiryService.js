import axios from "axios";

const API = "https://coker-creative-fullstack.onrender.com/api/inquiries";

// CREATE
export const createInquiry = async (formData) => {
  const { data } = await axios.post(API, formData);

  return data;
};

// GET
export const getInquiries = async () => {
  const { data } = await axios.get(API);

  return data;
};

// UPDATE STATUS
export const updateInquiryStatus = async (id, status) => {
  const { data } = await axios.put(`${API}/${id}/status`, { status });

  return data;
};

// DELETE
export const deleteInquiry = async (id) => {
  const { data } = await axios.delete(`${API}/${id}`);

  return data;
};
