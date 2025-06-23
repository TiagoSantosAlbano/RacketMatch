import api from '../services/api';
import { Tenant } from '../models/tenant';

// Buscar todos os tenants
export async function getTenants(): Promise<Tenant[]> {
  const response = await api.get('/tenants');
  return response.data;
}

// Criar novo tenant
export async function createTenant(data: Partial<Tenant>): Promise<Tenant> {
  const response = await api.post('/tenants', data);
  return response.data;
}
