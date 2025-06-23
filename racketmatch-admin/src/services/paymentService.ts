  import api from '../services/api';
  import { Payment, PaymentCreateDTO } from '../models/payment';

  export const getPayments = async (): Promise<Payment[]> => {
    const response = await api.get('/admin/payments');
    return response.data;
  };

  export const createPayment = async (data: PaymentCreateDTO): Promise<Payment> => {
    const response = await api.post('/admin/payments', data);
    return response.data;
  };
