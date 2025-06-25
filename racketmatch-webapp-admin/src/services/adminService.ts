import api from './api';

interface LoginPayload {
  email: string;
  password: string;
}

export async function loginAdmin(data: { email: string; password: string }) {
  const response = await api.post('/admin-auth/login', data);
  return response.data;
}

export const registerAdmin = async (data: LoginPayload) => {
  await api.post('/admin-auth/register', data);
};

export const logoutAdmin = () => {
  localStorage.removeItem('adminToken');
};

export const getAdminToken = () => {
  return localStorage.getItem('adminToken');
};

export const checkIfAdminExists = async (): Promise<boolean> => {
  const response = await api.get('/admin-auth/exists'); // ✅ Rota corrigida
  return response.data.exists;
};
