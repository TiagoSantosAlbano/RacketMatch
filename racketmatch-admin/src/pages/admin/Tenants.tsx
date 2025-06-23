import { useState } from 'react';
import { useTenants, useCreateTenant } from '../../hooks/useTenants';
import { Tenant } from '../../models/tenant';

export default function Tenants() {
  const { data: tenants = [], isLoading, error } = useTenants();
  const createTenant = useCreateTenant();

  const [form, setForm] = useState<Partial<Tenant>>({
    name: '',
    email: '',
    phone: '',
    commissionRate: 15
  });

  const handleCreate = () => {
    if (!form.name || !form.email) {
      alert('Nome e email são obrigatórios.');
      return;
    }

    createTenant.mutate(form, {
      onSuccess: () => {
        setForm({
          name: '',
          email: '',
          phone: '',
          commissionRate: 15
        });
      }
    });
  };

  if (isLoading) return <div className="p-8">Loading tenants...</div>;
  if (error) return <div className="p-8 text-red-600">Error loading tenants</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">🏢 Tenants Management</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        <input
          className="border p-2 rounded"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          className="border p-2 rounded w-36"
          placeholder="Commission %"
          type="number"
          value={form.commissionRate}
          onChange={(e) =>
            setForm({ ...form, commissionRate: Number(e.target.value) })
          }
        />
        <button
          onClick={handleCreate}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Create
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Commission %</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((t: Tenant) => (
            <tr key={t._id} className="text-center">
              <td className="border p-2">{t.name}</td>
              <td className="border p-2">{t.email}</td>
              <td className="border p-2">{t.phone}</td>
              <td className="border p-2">{t.commissionRate} %</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
