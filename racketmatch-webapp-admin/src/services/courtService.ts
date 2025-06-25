// src/services/courtService.ts

import api from './api'; // corrigido caminho
import { Court } from '../models/court';

export const getCourts = async (): Promise<Court[]> => {
  const response = await api.get('/admin/courts'); // rota corrigida
  return response.data;
};

export const createCourt = async (courtData: Partial<Court>): Promise<Court> => {
  const response = await api.post('/admin/courts', courtData); // rota corrigida
  return response.data.court; // retorna .court conforme a resposta no backend
};

export const updateCourt = async (id: string, courtData: Partial<Court>): Promise<Court> => {
  const response = await api.put(`/admin/courts/${id}`, courtData);
  return response.data.court;
};

export const deleteCourt = async (id: string): Promise<void> => {
  await api.delete(`/admin/courts/${id}`);
};
