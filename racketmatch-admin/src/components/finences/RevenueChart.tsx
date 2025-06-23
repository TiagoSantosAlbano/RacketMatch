import { Payment } from '../../models/payment';
import { format } from 'date-fns';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface Props {
  payments: Payment[];
}

export default function RevenueChart({ payments }: Props) {
  // Agrupar receita por dia
  const dailyRevenue: Record<string, number> = {};

  payments.forEach((p) => {
    const date = format(new Date(p.createdAt), 'yyyy-MM-dd');
    dailyRevenue[date] = (dailyRevenue[date] ?? 0) + (p.amount ?? 0);
  });

  // Transformar em array para o gráfico
  const chartData = Object.entries(dailyRevenue).map(([date, revenue]) => ({
    date,
    revenue,
  }));

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="font-bold text-lg mb-4">Revenue Over Time 📈</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis unit=" €" />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#4CAF50" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
