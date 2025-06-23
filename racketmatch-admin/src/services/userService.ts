// src/services/userService.ts
import api from './api';
import { User, UserCreateDTO } from '../models/user';

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get('/adminUsers');
  return response.data;
};

export const createUser = async (userData: UserCreateDTO): Promise<User> => {
  const response = await api.post('/adminUsers', userData);
  return response.data;
};

export const updateUser = async (
  id: string,
  userData: Partial<UserCreateDTO>
): Promise<User> => {
  const response = await api.put(`/adminUsers/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/adminUsers/${id}`);
};
