import axios from 'axios';

// Usa a variável do .env, para Expo é sempre EXPO_PUBLIC_API_URL
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL, // Usa o valor do teu .env
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default api;
