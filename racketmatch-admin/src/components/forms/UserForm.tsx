import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { User } from '../../models/user';

const schema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email'),
  role: z.string().min(1, 'Role is required'),
});

type FormValues = z.infer<typeof schema>;

interface UserFormProps {
  initialData?: User;
  onSubmit: (data: FormValues) => void;
}

export const UserForm = ({ initialData, onSubmit }: UserFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: initialData?.username || '',
      email: initialData?.email || '',
      role: initialData?.role || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded shadow">
      <div>
        <label>Username</label>
        <input {...register('username')} className="border p-2 w-full rounded" />
        {errors.username && <p className="text-red-500">{errors.username.message}</p>}
      </div>

      <div>
        <label>Email</label>
        <input {...register('email')} className="border p-2 w-full rounded" />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <label>Role</label>
        <input {...register('role')} className="border p-2 w-full rounded" />
        {errors.role && <p className="text-red-500">{errors.role.message}</p>}
      </div>

      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        {initialData ? 'Update User' : 'Create User'}
      </button>
    </form>
  );
};
