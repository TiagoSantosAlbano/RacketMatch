import { useEffect, useState } from 'react';

export interface FormValues {
  name: string;
  location: string;
  type: string;
  price?: number;
  image?: File;
}

interface CourtFormProps {
  initialData?: FormValues;
  onSubmit: (data: FormValues) => void;
}

export function CourtForm({ initialData, onSubmit }: CourtFormProps) {
  const [formData, setFormData] = useState<FormValues>({
    name: '',
    location: '',
    type: '',
    price: undefined,
    image: undefined,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Nome do court"
        required
        className="input text-black"
      />
      <input
        type="text"
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="Localização"
        required
        className="input text-black"
      />
      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        required
        className="input text-black"
      >
        <option value="">Tipo de campo</option>
        <option value="Coberto Normal">Coberto Normal</option>
        <option value="Coberto Sintético">Coberto Sintético</option>
        <option value="Descoberto Normal">Descoberto Normal</option>
        <option value="Descoberto Sintético">Descoberto Sintético</option>
      </select>
      <input
        type="number"
        name="price"
        value={formData.price || ''}
        onChange={handleChange}
        placeholder="Preço"
        className="input text-black"
      />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        {initialData ? 'Atualizar' : 'Criar'}
      </button>
    </form>
  );
}
