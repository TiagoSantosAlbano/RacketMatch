    import { Payment } from '../../models/payment';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface Props {
  payments: Payment[];
}

export default function TopCourts({ payments }: Props) {
  // Agrupar receita por campo
  const courtRevenue: Record<string, number> = {};

  payments.forEach((p) => {
    const courtName = p.court?.name ?? 'Unknown';
    courtRevenue[courtName] = (courtRevenue[courtName] ?? 0) + (p.amount ?? 0);
  });

  // Ordenar pelo campo com maior receita
  const chartData = Object.entries(courtRevenue)
    .map(([court, revenue]) => ({ court, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10); // Top 10 campos

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="font-bold text-lg mb-4">Top Courts 🏟️</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" unit=" €" />
          <YAxis dataKey="court" type="category" />
          <Tooltip />
          <Bar dataKey="revenue" fill="#F59E0B" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
