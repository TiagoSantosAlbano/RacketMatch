import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Court } from '../../models/court';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  location: z.string().min(1, 'Location is required'),
  type: z.string().optional(),
  price: z.number().optional(),
});

type FormValues = z.infer<typeof schema>;

interface CourtFormProps {
  initialData?: Court; // Permite usar o form também para editar
  onSubmit: (data: FormValues) => void;
}

export const CourtForm = ({ initialData, onSubmit }: CourtFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name || '',
      location: initialData?.location || '',
      type: initialData?.type || '',
      price: initialData?.price || 0,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded shadow">
      <div>
        <label className="block font-medium mb-1">Name</label>
        <input {...register('name')} className="border p-2 w-full rounded" />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block font-medium mb-1">Location</label>
        <input {...register('location')} className="border p-2 w-full rounded" />
        {errors.location && <p className="text-red-500">{errors.location.message}</p>}
      </div>

      <div>
        <label className="block font-medium mb-1">Type</label>
        <input {...register('type')} className="border p-2 w-full rounded" />
      </div>

      <div>
        <label className="block font-medium mb-1">Price (€)</label>
        <input type="number" {...register('price', { valueAsNumber: true })} className="border p-2 w-full rounded" />
      </div>

      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        {initialData ? 'Update Court' : 'Create Court'}
      </button>
    </form>
  );
};
