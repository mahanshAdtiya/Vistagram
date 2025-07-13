import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL,
  withCredentials: true,
});
api.interceptors.request.use((config) => {
  const isFormData = config.data instanceof FormData;

  if (!isFormData) {
    config.headers['Content-Type'] = 'application/json';
  }else{
    config.headers['Content-Type'] = 'multipart/form-data';
  }

  return config;
});
