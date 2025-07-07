import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Court {
  _id: string;
  name: string;
  location: string;
 
}

export function useCourts() {
  return useQuery<Court[]>({
    queryKey: ['courts'],
    queryFn: async () => {
      const { data } = await axios.get('/api/courts');
      return data;
    },
  });
}
