// src/hooks/useCourts.ts
import { useQuery } from '@tanstack/react-query';
import { getCourts } from '../services/courtService';
import { Court } from '../models/court';

export function useCourts() {
  return useQuery<Court[]>({
    queryKey: ['courts'],
    queryFn: getCourts
  });
}
