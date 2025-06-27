import api from './api'; // axios customizado com interceptor de token

// Interface para payload de registro genérico
interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  role: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

// ======= REGISTRO =======
export function register(data: RegisterPayload) {
  return api.post('/register', data);
}

// ======= LOGIN (Admin ou geral) =======
export async function loginAdmin(data: LoginPayload): Promise<void> {
  const response = await api.post('/admin/login', data);
  const token = response.data.token;

  if (token) {
    localStorage.setItem('token', token);
  } else {
    throw new Error('Token não recebido do servidor');
  }
}

// ======= LOGOUT =======
export function logoutAdmin() {
  localStorage.removeItem('token');
}

// ======= GET TOKEN =======
export function getAdminToken(): string | null {
  return localStorage.getItem('token');
}

// ======= CHECK EXISTÊNCIA (exemplo adicional) =======
export async function checkIfAdminExists(email: string): Promise<boolean> {
  const response = await api.get(`/admin/check-email?email=${email}`);
  return response.data.exists;
}
