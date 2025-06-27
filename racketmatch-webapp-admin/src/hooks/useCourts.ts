import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getCourts } from '../services/courtService';
import { Court } from '../models/court';

export function useCourts(): UseQueryResult<Court[], Error> {
  return useQuery({
    queryKey: ['courts'],
    queryFn: getCourts,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 1,
    // o onError deve ser definido via .onError no handler de erro
  });
}
