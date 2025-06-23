// src/services/matchService.ts
import api from './api';
import { Match } from '../models/match'; // caminho ajustado

export const getMatches = async () => {
  const response = await api.get('/adminMatches');
  return response.data;
};

export const createMatch = async (matchData: Match) => {
  const response = await api.post('/adminMatches', matchData);
  return response.data;
};

export const updateMatch = async (id: string, matchData: Match) => {
  const response = await api.put(`/adminMatches/${id}`, matchData);
  return response.data;
};

export const deleteMatch = async (id: string) => {
  const response = await api.delete(`/adminMatches/${id}`);
  return response.data;
};
