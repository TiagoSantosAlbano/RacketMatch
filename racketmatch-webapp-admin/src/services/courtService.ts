import api from './api';
import { Court } from '../models/court';

const COURTS_ENDPOINT = '/admin/courts';

export async function getCourts(): Promise<Court[]> {
  const response = await api.get(COURTS_ENDPOINT);
  return response.data;
}

export async function createCourt(data: FormData): Promise<Court> {
  const response = await api.post(COURTS_ENDPOINT, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function updateCourt(id: string, data: FormData): Promise<Court> {
  const response = await api.put(`${COURTS_ENDPOINT}/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function deleteCourt(id: string): Promise<void> {
  await api.delete(`${COURTS_ENDPOINT}/${id}`);
}
