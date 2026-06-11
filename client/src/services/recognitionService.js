import axios from "axios";

const API = "https://coker-creative-fullstack.onrender.com/api/recognitions";

// GET
export const getRecognitions = async () => {
  const { data } = await axios.get(API);

  return data;
};

// CREATE
export const createRecognition = async (formData) => {
  const { data } = await axios.post(API, formData);

  return data;
};

// DELETE
export const deleteRecognition = async (id) => {
  const { data } = await axios.delete(`${API}/${id}`);

  return data;
};
