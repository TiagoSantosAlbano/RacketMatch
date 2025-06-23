import api from '../services/api';
import { Court } from '../models/court';

export const getCourts = async (): Promise<Court[]> => {
  const response = await api.get('/adminCourts');
  return response.data;
};

export const createCourt = async (courtData: Partial<Court>): Promise<Court> => {
  const response = await api.post('/adminCourts', courtData);
  return response.data;
};

export const updateCourt = async (id: string, courtData: Partial<Court>): Promise<Court> => {
  const response = await api.put(`/adminCourts/${id}`, courtData);
  return response.data;
};

export const deleteCourt = async (id: string): Promise<void> => {
  await api.delete(`/adminCourts/${id}`);
};
