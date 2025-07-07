// src/pages/admin/CourtsDashboard.tsx
import React, { useEffect, useState } from "react";
import CourtCard from "../courts/CourtCard";
import CourtModal from "./CourtModal";
import { Court } from "../../models/court";

const CourtsDashboard: React.FC = () => {
  const [courts, setCourts] = useState<Court[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      const res = await fetch("http://31.97.177.93:5000/api/admin/courts");
      const data = await res.json();
      setCourts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar courts:", err);
      setCourts([]);
    }
  };

  const handleCreateCourt = async (newCourt: Partial<Court>) => {
    try {
      const res = await fetch("http://31.97.177.93:5000/api/admin/courts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCourt),
      });

      if (res.ok) {
        const created = await res.json();
        setCourts((prev) => [...prev, created]);
        setIsModalOpen(false);
      } else {
        alert("Erro ao criar court.");
      }
    } catch (err) {
      alert("Erro ao criar court.");
      console.error(err);
    }
  };

  const handleUpdateCourt = async (updated: Partial<Court>) => {
    if (!editingCourt?._id) return;

    try {
      const res = await fetch(
        `http://31.97.177.93:5000/api/admin/courts/${editingCourt._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        }
      );

      if (res.ok) {
        const updatedCourt = await res.json();
        setCourts((prev) =>
          prev.map((court) =>
            court._id === updatedCourt._id ? updatedCourt : court
          )
        );
        setIsModalOpen(false);
        setEditingCourt(null);
      } else {
        alert("Erro ao atualizar court.");
      }
    } catch (err) {
      alert("Erro ao atualizar court.");
      console.error(err);
    }
  };

  const handleDeleteCourt = async (id: string) => {
    if (!window.confirm("Tens a certeza que queres eliminar este court?")) return;
    try {
      const res = await fetch(
        `http://31.97.177.93:5000/api/admin/courts/${id}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setCourts((prev) => prev.filter((court) => court._id !== id));
      } else {
        alert("Erro ao eliminar court.");
      }
    } catch (err) {
      alert("Erro ao eliminar court.");
      console.error(err);
    }
  };

  // Fecha modal e reseta editingCourt
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourt(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestão de Courts</h1>
        <button
          onClick={() => {
            if (!isModalOpen) {
              setEditingCourt(null);
              setIsModalOpen(true);
            }
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
        >
          + Novo Court
        </button>
      </div>

      {courts.length === 0 ? (
        <p className="text-gray-500">Nenhum court encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courts.map((court) => (
            <CourtCard
              key={court._id}
              court={court}
              onDelete={handleDeleteCourt}
              onEdit={(court) => {
                setEditingCourt(court);
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <CourtModal
          onClose={handleCloseModal}
          onSubmit={editingCourt ? handleUpdateCourt : handleCreateCourt}
          initialData={editingCourt || undefined}
        />
      )}
    </div>
  );
};

export default CourtsDashboard;
