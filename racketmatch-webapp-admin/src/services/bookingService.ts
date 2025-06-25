import api from './api';
import { Booking } from '../models/booking'; // Certifica-te que o modelo está correto

// Obter todas as reservas
export const getBookings = async () => {
  const response = await api.get('/bookingRoutes');
  return response.data;
};

// Criar nova reserva
export const createBooking = async (bookingData: Booking) => {
  const response = await api.post('/bookingRoutes', bookingData);
  return response.data;
};

// Atualizar reserva existente
export const updateBooking = async (id: string, bookingData: Booking) => {
  const response = await api.put(`/bookingRoutes/${id}`, bookingData);
  return response.data;
};

// Eliminar reserva
export const deleteBooking = async (id: string) => {
  const response = await api.delete(`/bookingRoutes/${id}`);
  return response.data;
};

// 🔍 NOVA FUNÇÃO: Obter número de reservas por utilizador (para o gráfico)
export const getBookingsPerUser = async () => {
  const response = await api.get('/bookingRoutes/per-user');
  return response.data;
};
