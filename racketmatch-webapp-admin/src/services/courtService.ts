// src/services/courtService.ts

import api from './api';
import { Court } from '../models/court';

// GET – Buscar todos os courts
export const getCourts = async (): Promise<Court[]> => {
  const response = await api.get('/admin/courts');
  return response.data;
};

// POST – Criar novo court com FormData
export const createCourt = async (courtData: FormData): Promise<Court> => {
  const response = await api.post('/admin/courts', courtData, {
    // headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// PUT – Atualizar court com FormData
export const updateCourt = async (id: string, courtData: FormData): Promise<Court> => {
  const response = await api.put(`/admin/courts/${id}`, courtData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// DELETE – Remover court
export const deleteCourt = async (id: string): Promise<void> => {
  await api.delete(`/admin/courts/${id}`);
};
