import axios from 'axios';

// Usa a variável do .env, para Expo é sempre EXPO_PUBLIC_API_URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Usa o valor do teu .env
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default api;
