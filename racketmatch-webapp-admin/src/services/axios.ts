import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://31.97.177.93:5000/api',
});

// Intercepta todas as requisições e adiciona o token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
