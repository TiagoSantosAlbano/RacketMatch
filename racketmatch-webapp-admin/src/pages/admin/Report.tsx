import { useMemo } from 'react';
import { format } from 'date-fns';
import { usePayments } from '../../hooks/usePayments';
import { Payment } from '../../models/payment';

export default function Report() {
  const { data: payments = [] } = usePayments();

  const totalRevenue = useMemo(() =>
    payments.reduce((sum: number, p: Payment) => sum + (p.amount || 0), 0),
    [payments]
  );

  const totalCommission = useMemo(() =>
    payments.reduce((sum: number, p: Payment) => sum + (p.commission || 0), 0),
    [payments]
  );

  const totalMatches = payments.length;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">📊 Financial Report PRO</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-100 p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-2">💰 Total Revenue</h2>
          <p className="text-2xl font-bold">{totalRevenue.toFixed(2)} €</p>
        </div>

        <div className="bg-yellow-100 p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-2">🧮 Total Commission</h2>
          <p className="text-2xl font-bold">{totalCommission.toFixed(2)} €</p>
        </div>

        <div className="bg-blue-100 p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-2">🎾 Total Matches</h2>
          <p className="text-2xl font-bold">{totalMatches}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">📅 Payments History</h2>

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">User</th>
            <th className="border p-2">Court</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">Commission</th>
            <th className="border p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p: Payment) => (
            <tr key={p._id} className="text-center">
              <td className="border p-2">{p.user?.username}</td>
              <td className="border p-2">{p.court?.name}</td>
              <td className="border p-2">{p.amount} €</td>
              <td className="border p-2">{p.commission} €</td>
              <td className="border p-2">
                {format(new Date(p.createdAt), 'dd/MM/yyyy HH:mm')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
