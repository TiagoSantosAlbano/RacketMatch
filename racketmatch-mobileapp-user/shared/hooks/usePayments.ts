import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type Payment = {
  _id: string;
  user_id: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export function usePayments() {
  return useQuery<Payment[], Error>({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data } = await axios.get<Payment[]>('/api/payments');
      return data;
    },
  });
}
