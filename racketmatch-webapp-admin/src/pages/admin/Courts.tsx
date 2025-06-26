import { useState } from 'react';
import { createCourt, deleteCourt, updateCourt } from '../../services/courtService';
import { CourtForm, FormValues } from '../../components/forms/CourtForm';
import CourtCard from '../../components/courts/CourtCard';
import { useCourts } from '../../hooks/useCourts';
import { useTheme } from '../../hooks/useTheme';
import { Court } from '../../models/court';

export default function CourtsPage() {
  const { data: courts = [], isLoading, error, refetch } = useCourts();
  const { theme } = useTheme();

  const [showForm, setShowForm] = useState(false);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);

  const handleCourtSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('location', data.location);
      formData.append('type', data.type[0]); // envia só um tipo como string
      if (data.price !== undefined) formData.append('price', String(data.price));
      if (data.image) formData.append('image', data.image);

      if (editingCourt) {
        await updateCourt(editingCourt._id, formData);
        alert('Court atualizado com sucesso!');
      } else {
        await createCourt(formData);
        alert('Court criado com sucesso!');
      }

      refetch();
      setShowForm(false);
      setEditingCourt(null);
    } catch (err) {
      console.error('Erro ao salvar court:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar este campo?')) return;

    try {
      await deleteCourt(id);
      refetch();
    } catch (err) {
      console.error('Erro ao eliminar campo:', err);
    }
  };

  const handleEdit = (court: Court) => {
    setEditingCourt(court);
    setShowForm(true);
  };

  if (isLoading) return <div>Loading courts...</div>;
  if (error) return <div>Error loading courts!</div>;

  return (
    <div className={`p-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Courts</h1>
        <button
          onClick={() => {
            setEditingCourt(null);
            setShowForm(!showForm);
          }}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          {showForm ? 'Cancel' : 'Add Court'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <CourtForm onSubmit={handleCourtSubmit} initialData={editingCourt || undefined} />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {courts.map((court) => (
          <CourtCard
            key={court._id}
            court={court}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  );
}
