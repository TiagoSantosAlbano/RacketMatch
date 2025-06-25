import api from './api'; // certifique-se de que esse caminho está correto

import {
  loginAdmin,
  registerAdmin,
  logoutAdmin,
  getAdminToken,
  checkIfAdminExists
} from './adminService';

// Interface para payload de registro genérico
interface RegisterPayload {
  email: string;
  password: string;
  name: string;
    role: string; 
}

// Função genérica de registro para usuários
export function register(data: RegisterPayload) {
  return api.post('/register', data);
}

// Reexportar funções de admin para manter uma API de autenticação coesa
export {
  loginAdmin,
  registerAdmin,
  logoutAdmin,
  getAdminToken,
  checkIfAdminExists
};
