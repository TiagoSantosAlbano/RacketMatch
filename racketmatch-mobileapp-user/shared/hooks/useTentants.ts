import { useEffect, useState } from "react";
import axios from "axios";


const API_URL = "http://localhost:5000/api/tenants";

export interface Tenant {
  _id: string;
  name: string;
 
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
        setTenants(res.data); 
      } catch (err: any) {
        setError(err?.response?.data?.message || "Erro ao procurar tenants.");
      } finally {
        setLoading(false);
      }
    }
    fetchTenants();
  }, []);

  return { tenants, loading, error };
}
