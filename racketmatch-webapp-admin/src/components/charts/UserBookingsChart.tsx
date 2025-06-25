import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getBookingsPerUser } from '../../services/bookingService';

interface BookingData {
  userName: string;
  count: number;
}

export default function UserBookingsChart() {
  const [data, setData] = useState<BookingData[]>([]);

  useEffect(() => {
  getBookingsPerUser()
    .then((response: BookingData[]) => {
      setData(response);
    })
    .catch((error: unknown) => {
      console.error('Erro ao carregar dados de reservas por utilizador:', error);
    });
}, []);


  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">📅 Reservas por Utilizador</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="userName" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
