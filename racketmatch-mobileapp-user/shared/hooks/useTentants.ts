import { useEffect, useState } from "react";
import axios from "axios";

// Endereço do teu backend!
const API_URL = "http://31.97.177.93:5000/api/tenants";

export interface Tenant {
  _id: string;
  name: string;
  // ... outros campos que tiveres no modelo de tenant
}

export function useTenants() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTenants() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(API_URL);
        setTenants(res.data); // ou res.data.tenants depende do teu backend!
      } catch (err: any) {
        setError(err?.response?.data?.message || "Erro ao buscar tenants.");
      } finally {
        setLoading(false);
      }
    }
    fetchTenants();
  }, []);

  return { tenants, loading, error };
}
