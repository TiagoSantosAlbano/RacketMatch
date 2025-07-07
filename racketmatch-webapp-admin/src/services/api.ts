import axios, { InternalAxiosRequestConfig } from 'axios';

// Defina o endpoint da sua API diretamente aqui
const BASE_URL = 'http://31.97.177.93:5000/api'; // ajuste se mudar o host/porta no backend

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// ➕ Interceptor de requisição: adiciona token JWT se houver
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Erro no interceptor de requisição:', error);
    return Promise.reject(error);
  }
);

// ⚠️ Interceptor de resposta: captura erros úteis
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('❌ Erro de resposta da API:', {
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      console.error('❌ Sem resposta da API:', error.request);
    } else {
      console.error('❌ Erro na configuração da requisição:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
