import React, { useEffect, useState } from "react";

interface Booking {
  _id: string;
  user: { name: string; email: string };
  court: string;
  date: string;
  status: string;
}

const BookingDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://31.97.177.93:5000/api/admin/bookings");
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Erro ao carregar bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tens a certeza que queres eliminar esta reserva?")) return;
    try {
      await fetch(`http://31.97.177.93:5000/api/admin/bookings/${id}`, {
        method: "DELETE",
      });
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Erro ao eliminar reserva:", err);
      alert("Erro ao eliminar reserva");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Gestão de Reservas</h1>
      {loading ? (
        <p>A carregar reservas...</p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-500">Nenhuma reserva encontrada.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded shadow p-4">
              <div>
                <span className="font-semibold">Utilizador:</span>{" "}
                {booking.user?.name} ({booking.user?.email})
              </div>
              <div>
                <span className="font-semibold">Court:</span> {booking.court}
              </div>
              <div>
                <span className="font-semibold">Data:</span>{" "}
                {new Date(booking.date).toLocaleString("pt-PT")}
              </div>
              <div>
                <span className="font-semibold">Estado:</span>{" "}
                <span className="text-green-600">{booking.status}</span>
              </div>
              <button
                className="mt-3 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={() => handleDelete(booking._id)}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingDashboard;
