import React from "react";
import { Court } from "../../models/court";
import { CourtForm, FormValues } from "../forms/CourtForm";

interface CourtModalProps {
  onClose: () => void;
  onSubmit: (data: Partial<Court>) => void;
  initialData?: Court;
}


function courtToFormValues(court?: Court): FormValues | undefined {
  if (!court) return undefined;
  return {
    name: court.name || "",
    location: court.location || "",
    type: court.type || "",
    price: court.price,
    image: undefined, 
    imageUrl: typeof court.image === "string" ? court.image : undefined,
  };
}

const CourtModal: React.FC<CourtModalProps> = ({ onClose, onSubmit, initialData }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md">
        <CourtForm
          initialData={courtToFormValues(initialData)}
          onSubmit={(data: FormValues) => {
            const submitData: Partial<Court> = {
              ...(initialData?._id ? { _id: initialData._id } : {}),
              name: data.name,
              location: data.location,
              type: data.type,
              price: data.price,
            };
            onSubmit(submitData);
            onClose();
          }}
        />
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="text-red-500 hover:underline text-sm"
            type="button"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourtModal;
