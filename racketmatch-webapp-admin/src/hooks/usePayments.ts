import { useQuery } from '@tanstack/react-query';
import { getPayments } from '../services/paymentService';
import { Payment } from '../models/payment';

export function usePayments() {
  return useQuery<Payment[]>({
    queryKey: ['payments'],
    queryFn: getPayments
  });
}
