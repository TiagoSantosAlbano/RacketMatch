import React from "react";
import { Court } from "../../models/court";

interface CourtCardProps {
  court: Court;
  imageUrl?: string;
  isAvailable?: boolean;
  onEdit?: (court: Court) => void;
  onDelete?: (id: string) => void;
}

export default function CourtCard({
  court,
  imageUrl,
  isAvailable = true,
  onEdit,
  onDelete,
}: CourtCardProps) {
  const displayImage = imageUrl || court.image;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-md overflow-hidden transition hover:shadow-lg">
      {displayImage && (
        <img
          src={displayImage}
          alt={`Imagem do campo ${court.name}`}
          className="w-full h-40 object-cover"
        />
      )}
      <div className="p-4 space-y-1">
        <h3 className="text-lg font-bold text-green-700 dark:text-green-400">
          {court.name}
        </h3>

        {court.type && (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            🏷️ Piso: {court.type}
          </p>
        )}

        <p className="text-sm text-gray-600 dark:text-gray-300">
          📍 Localização: {court.location}
        </p>

        {court.price !== undefined && (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            💶 Preço: {court.price.toFixed(2)}€
          </p>
        )}

        <p
          className={`mt-2 text-sm font-semibold ${
            isAvailable ? "text-green-600" : "text-red-600"
          }`}
        >
          {isAvailable ? "🟢 Disponível" : "🔴 Indisponível"}
        </p>

        {(onEdit || onDelete) && (
          <div className="flex justify-end gap-4 mt-4">
            {onEdit && (
              <button
                onClick={() => onEdit(court)}
                className="text-blue-600 text-sm hover:underline"
              >
                ✏️ Editar
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(court._id)}
                className="text-red-600 text-sm hover:underline"
              >
                🗑️ Eliminar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
