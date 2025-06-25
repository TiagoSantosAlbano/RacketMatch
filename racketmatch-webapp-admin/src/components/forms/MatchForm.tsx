import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Match } from '../../models/match';

const schema = z.object({
  court_id: z.string().min(1, 'Court is required'),
  match_date: z.string().min(1, 'Match date is required'),
  match_time: z.string().min(1, 'Match time is required'),
  players: z.array(z.string()),
});

type FormValues = z.infer<typeof schema>;

interface MatchFormProps {
  initialData?: Match;
  onSubmit: (data: FormValues) => void;
}

export const MatchForm = ({ initialData, onSubmit }: MatchFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      court_id: initialData?.court_id || '',
      match_date: initialData?.match_date || '',
      match_time: initialData?.match_time || '',
      players: initialData?.players || [],
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded shadow">
      <div>
        <label>Court ID</label>
        <input {...register('court_id')} className="border p-2 w-full rounded" />
        {errors.court_id && <p className="text-red-500">{errors.court_id.message}</p>}
      </div>

      <div>
        <label>Match Date</label>
        <input {...register('match_date')} className="border p-2 w-full rounded" />
        {errors.match_date && <p className="text-red-500">{errors.match_date.message}</p>}
      </div>

      <div>
        <label>Match Time</label>
        <input {...register('match_time')} className="border p-2 w-full rounded" />
        {errors.match_time && <p className="text-red-500">{errors.match_time.message}</p>}
      </div>

      <div>
        <label>Players (comma separated)</label>
        <input
          {...register('players', {
            setValueAs: (v) => v.split(',').map((s: string) => s.trim()),
          })}
          className="border p-2 w-full rounded"
        />
      </div>

      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        {initialData ? 'Update Match' : 'Create Match'}
      </button>
    </form>
  );
};
