import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { month: 'Jan', revenue: 1200 },
  { month: 'Feb', revenue: 900 },
  { month: 'Mar', revenue: 1400 },
  { month: 'Apr', revenue: 1100 },
  { month: 'May', revenue: 1600 },
];

export default function RevenueLineChart() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">📈 Receita Mensal</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
