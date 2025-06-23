import api from './api';
import { Booking } from '../models/booking'; // caminho corrigido

export const getBookings = async () => {
  const response = await api.get('/bookingRoutes');
  return response.data;
};

export const createBooking = async (bookingData: Booking) => {
  const response = await api.post('/bookingRoutes', bookingData);
  return response.data;
};

export const updateBooking = async (id: string, bookingData: Booking) => {
  const response = await api.put(`/bookingRoutes/${id}`, bookingData);
  return response.data;
};

export const deleteBooking = async (id: string) => {
  const response = await api.delete(`/bookingRoutes/${id}`);
  return response.data;
};
