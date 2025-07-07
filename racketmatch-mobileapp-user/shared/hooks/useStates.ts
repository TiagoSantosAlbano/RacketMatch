import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type State = {
  id: string;
  name: string;

};

export function useStates() {
  return useQuery<State[], Error>({
    queryKey: ['states'],
    queryFn: async () => {
      const { data } = await axios.get<State[]>('/api/states');
      return data;
    },
  });
}
