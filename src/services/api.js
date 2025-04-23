import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Your backend URL

// Fetch All Projects
export const getProjects = async () => {
  const response = await axios.get(`${API_URL}/projects`);
  return response.data;
};

// Fetch Single Project by ID
export const getProjectById = async (id) => {
  const response = await axios.get(`${API_URL}/projects/${id}`);
  return response.data;
};

// Fetch All Products
export const getProducts = async () => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data;
};

// Fetch Single Product by ID
export const getProductById = async (id) => {
  const response = await axios.get(`${API_URL}/products/${id}`);
  return response.data;
};
