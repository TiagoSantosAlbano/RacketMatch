import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Court A', value: 400 },
  { name: 'Court B', value: 300 },
  { name: 'Court C', value: 200 },
];

const COLORS = ['#10B981', '#3B82F6', '#F59E0B'];

export default function CourtUsageDonut() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">🎾 Utilização por Court</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={5}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
