// config/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.84:5000/api', // ✅ Atualiza conforme teu IP
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Tempo limite para evitar bloqueios prolongados
});

export default api;
