import React from "react";
import { Court } from "../../models/court";
import { CourtForm } from "../forms/CourtForm";

interface CourtModalProps {
  onClose: () => void;
  onSubmit: (data: Partial<Court>) => void;
  initialData?: Court;
}

const CourtModal = ({ onClose, onSubmit, initialData }: CourtModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md">
        <CourtForm
          initialData={initialData}
          onSubmit={(data) => {
            onSubmit(data);
            onClose(); // fecha o modal ao submeter
          }}
        />
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="text-red-500 hover:underline text-sm"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourtModal;
