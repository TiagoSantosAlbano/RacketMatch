
import { Payment } from '../../models/payment';
import { format } from 'date-fns';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface Props {
  payments: Payment[];
}

export default function MonthlyGrowthChart({ payments }: Props) {
  const monthlyData = payments.reduce((acc: Record<string, number>, payment) => {
    const month = format(new Date(payment.createdAt), 'yyyy-MM');
    acc[month] = (acc[month] || 0) + (payment.amount || 0);
    return acc;
  }, {});

  const chartData = Object.entries(monthlyData).map(([month, total]) => ({
    month,
    total,
  })).sort((a, b) => a.month.localeCompare(b.month));

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="text-xl font-bold mb-4">📈 Monthly Revenue Growth</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#10B981" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
