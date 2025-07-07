import { useEffect, useState } from 'react';

export interface FormValues {
  name: string;
  location: string;
  type: string;
  price?: number;
  image?: File;
  imageUrl?: string; // Para preview se editar
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
    imageUrl: undefined,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        image: undefined, // nunca passar string para o input file
        imageUrl: initialData.imageUrl || (typeof initialData.image === 'string' ? initialData.image : undefined),
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, files } = e.target as HTMLInputElement;
    if (type === "file") {
      const file = files && files[0] ? files[0] : undefined;
      setFormData((prev) => ({
        ...prev,
        image: file,
        imageUrl: file ? URL.createObjectURL(file) : prev.imageUrl,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'price' ? Number(value) : value,
      }));
    }
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
      <div>
        <input
          type="file"
          accept="image/*"
          name="image"
          onChange={handleChange}
          className="input"
        />
        {/* Preview da imagem, tanto File quanto url string */}
        {formData.imageUrl && (
          <img
            src={formData.imageUrl}
            alt="Preview"
            className="mt-2 w-32 h-24 object-cover rounded border"
          />
        )}
      </div>
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        {initialData ? 'Atualizar' : 'Criar'}
      </button>
    </form>
  );
}
