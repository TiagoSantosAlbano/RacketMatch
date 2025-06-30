import api from '../config/api';

export interface User {
  id: string;
  name: string;
  email: string;
  skillLevel: number;
  preferredLocations: string[];
  preferredTimes: string[];
  tenantId: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  skillLevel: number;
  preferredLocations: string[];
  preferredTimes: string[];
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  tenantId: string;
}




export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  user?: User;
}

// 🟢 Registar novo utilizador
export async function registerUser(data: RegisterPayload): Promise<AuthResponse> {
  try {
    const response = await api.post('/users/register', {
      name: data.name,
      email: data.email,
      password: data.password,
      skill_level: data.skillLevel, // ✅ backend espera snake_case
      preferredLocations: data.preferredLocations,
      preferredTimes: data.preferredTimes,
      location: data.location,
      tenantId: data.tenantId,
    });

    return response.data;
  } catch (error: any) {
    console.error('❌ Erro ao registar utilizador:', error?.response?.data || error.message);
    throw error;
  }
}

// 🔐 Login do utilizador
export async function loginUser(data: LoginPayload): Promise<AuthResponse> {
  try {
    const response = await api.post('/users/login', data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Erro no login:', error?.response?.data || error.message);
    throw error;
  }
}
