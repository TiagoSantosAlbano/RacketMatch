import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type Location = {
  id: string;
  name: string;
};

export function useLocations() {
  return useQuery<Location[], Error>({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data } = await axios.get<Location[]>('/api/locations');
      return data;
    },
  });
}
