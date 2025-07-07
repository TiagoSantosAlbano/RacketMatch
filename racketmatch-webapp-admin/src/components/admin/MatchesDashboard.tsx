import React, { useEffect, useState } from "react";

interface Match {
  _id: string;
  title: string;
  location: string;
  date: string;
  hour: string;
  createdBy?: { name: string; email: string };
}

const MatchesDashboard = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://31.97.177.93:5000/api/admin/matches");
      const data = await res.json();
      setMatches(data);
    } catch (err) {
      console.error("Erro ao carregar partidas:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tens a certeza que queres eliminar esta partida?")) return;
    try {
      await fetch(`http://31.97.177.93:5000/api/admin/matches/${id}`, {
        method: "DELETE",
      });
      setMatches((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Erro ao eliminar partida:", err);
      alert("Erro ao eliminar partida");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Gestão de Partidas</h1>
      {loading ? (
        <p>A carregar partidas...</p>
      ) : matches.length === 0 ? (
        <p className="text-gray-500">Nenhuma partida encontrada.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <div key={match._id} className="bg-white rounded shadow p-4">
              <div>
                <span className="font-semibold">Título:</span> {match.title}
              </div>
              <div>
                <span className="font-semibold">Local:</span> {match.location}
              </div>
              <div>
                <span className="font-semibold">Data:</span> {match.date} {match.hour}
              </div>
              {match.createdBy && (
                <div>
                  <span className="font-semibold">Criador:</span> {match.createdBy.name} ({match.createdBy.email})
                </div>
              )}
              <button
                className="mt-3 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={() => handleDelete(match._id)}
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

export default MatchesDashboard;
