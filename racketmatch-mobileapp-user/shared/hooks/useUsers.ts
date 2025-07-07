import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type User = {
  id: string;
  username: string;
  email: string;
  
};

export function useUsers() {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await axios.get<User[]>('/api/users');
      return data;
    },
  });
}
