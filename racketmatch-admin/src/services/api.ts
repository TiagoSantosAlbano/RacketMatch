import axios, { InternalAxiosRequestConfig } from 'axios';

// 🌍 Base da API (usa variável de ambiente ou localhost como fallback)
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

// 🔧 Instância personalizada do Axios
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Interceptor de requisição → Insere o token automaticamente
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token'); // deve ser "token" conforme login.tsx
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Erro no request interceptor:', error);
    return Promise.reject(error);
  }
);

// ⚠️ Interceptor de resposta → Útil para erros globais (como 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ Erro na resposta da API:', error.response || error.message);
    return Promise.reject(error);
  }
);

export default api;
