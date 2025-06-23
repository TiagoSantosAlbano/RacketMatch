import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Booking } from '../../models/booking';

const schema = z.object({
  court: z.string().min(1, 'Court is required'),
  user: z.string().min(1, 'User is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
});

type FormValues = z.infer<typeof schema>;

interface BookingFormProps {
  initialData?: Booking;
  onSubmit: (data: FormValues) => void;
}

export const BookingForm = ({ initialData, onSubmit }: BookingFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      court: initialData?.court || '',
      user: initialData?.user || '',
      date: initialData?.date || '',
      time: initialData?.time || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded shadow">
      <div>
        <label>Court</label>
        <input {...register('court')} className="border p-2 w-full rounded" />
        {errors.court && <p className="text-red-500">{errors.court.message}</p>}
      </div>

      <div>
        <label>User</label>
        <input {...register('user')} className="border p-2 w-full rounded" />
        {errors.user && <p className="text-red-500">{errors.user.message}</p>}
      </div>

      <div>
        <label>Date</label>
        <input {...register('date')} className="border p-2 w-full rounded" />
        {errors.date && <p className="text-red-500">{errors.date.message}</p>}
      </div>

      <div>
        <label>Time</label>
        <input {...register('time')} className="border p-2 w-full rounded" />
        {errors.time && <p className="text-red-500">{errors.time.message}</p>}
      </div>

      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        {initialData ? 'Update Booking' : 'Create Booking'}
      </button>
    </form>
  );
};
