import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTenants, createTenant } from '../services/tenantService';
import { Tenant } from '../models/tenant';

export function useTenants() {
  return useQuery<Tenant[]>({
    queryKey: ['tenants'],
    queryFn: getTenants
  });
}

export function useCreateTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    }
  });
}
