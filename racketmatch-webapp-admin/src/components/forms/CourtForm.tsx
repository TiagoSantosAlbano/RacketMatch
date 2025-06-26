import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Court } from '../../models/court';
import { useTheme } from '../../context/ThemeContext';
import { useState } from 'react';

// Validação com Zod
const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  location: z.string().min(1, 'Location is required'),
  type: z.array(z.string()).min(1, 'At least one type is required'),
  price: z.number().optional(),
  image: z.any().optional(),
});

export type FormValues = z.infer<typeof schema>;

interface CourtFormProps {
  initialData?: Court;
  onSubmit: (data: FormValues) => void;
}

export const CourtForm = ({ initialData, onSubmit }: CourtFormProps) => {
  const { theme } = useTheme();
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name || '',
      location: initialData?.location || '',
      type: initialData?.type ? [initialData.type] : [],
      price: initialData?.price || 0,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('image', file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const inputClass =
    'border p-2 w-full rounded bg-transparent ' +
    (theme === 'dark' ? 'text-white border-gray-600' : 'text-black border-gray-300');

  const labelClass = 'block font-medium mb-1';

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`space-y-4 p-6 rounded shadow border ${
        theme === 'dark'
          ? 'bg-gray-900 text-white border-gray-700'
          : 'bg-white text-black border-gray-200'
      }`}
    >
      <div>
        <label className={labelClass}>Name</label>
        <input {...register('name')} className={inputClass} />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Location</label>
        <input {...register('location')} className={inputClass} />
        {errors.location && <p className="text-red-500">{errors.location.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Type</label>
        <select {...register('type')} multiple className={`${inputClass} h-32`}>
          <option value="Coberto Normal">Coberto Normal</option>
          <option value="Descoberto Normal">Descoberto Normal</option>
          <option value="Coberto Sintético">Coberto Sintético</option>
          <option value="Descoberto Sintético">Descoberto Sintético</option>
        </select>
        {errors.type && <p className="text-red-500">{errors.type.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Price (€)</label>
        <input
          type="number"
          {...register('price', { valueAsNumber: true })}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Imagem do campo</label>
        <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-2 h-32 w-32 rounded object-cover border"
          />
        )}
      </div>

      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
      >
        {initialData ? 'Update Court' : 'Create Court'}
      </button>
    </form>
  );
};
