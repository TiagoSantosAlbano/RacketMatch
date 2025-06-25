import { Payment } from '../../models/payment';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface Props {
  payments: Payment[];
}

export default function TopUsers({ payments }: Props) {
  // Agrupar receita por user
  const userRevenue: Record<string, number> = {};

  payments.forEach((p) => {
    const username = p.user?.username ?? 'Unknown';
    userRevenue[username] = (userRevenue[username] ?? 0) + (p.amount ?? 0);
  });

  // Ordenar pelo que gastou mais
  const chartData = Object.entries(userRevenue)
    .map(([user, revenue]) => ({ user, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10); // Top 10

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="font-bold text-lg mb-4">Top Users 💎</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" unit=" €" />
          <YAxis dataKey="user" type="category" />
          <Tooltip />
          <Bar dataKey="revenue" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
