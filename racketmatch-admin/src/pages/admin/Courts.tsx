import { createCourt } from '../../services/courtService';
import { Court } from '../../models/court';
import { CourtForm } from '../../components/forms/CourtForm';
import { CourtTable } from '../../components/tables/CourtTable';
import { useCourts } from '../../hooks/useCourts'; // <-- Hook React Query

export default function CourtsPage() {
  const {
    data: courts = [],
    isLoading,
    error,
    refetch
  } = useCourts();

  const handleCourtSubmit = async (data: Partial<Court>) => {
    try {
      await createCourt(data);
      alert('Court created successfully!');
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <div>Loading courts...</div>;
  if (error) return <div>Error loading courts!</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Courts</h1>

      <CourtForm onSubmit={handleCourtSubmit} />

      <div className="my-6">
        <CourtTable data={courts} />
      </div>
    </div>
  );
}
