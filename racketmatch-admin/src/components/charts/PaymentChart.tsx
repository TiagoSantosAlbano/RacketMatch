import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface PaymentData {
  month: string;
  total: number;
}

const data: PaymentData[] = [
  { month: 'Jan', total: 1200 },
  { month: 'Feb', total: 800 },
  { month: 'Mar', total: 1400 },
  { month: 'Apr', total: 900 },
];

export default function PaymentChart() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <h2 className="text-lg font-bold mb-4 text-gray-700 dark:text-gray-200">💰 Pagamentos por Mês</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
