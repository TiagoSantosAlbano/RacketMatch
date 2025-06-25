// src/models/payment.ts

export interface Payment {
  _id: string;
  user_id: string;
  amount: number;
  method: string;
  status: string;
  commission?: number; // ✅ adiciona a comissão se for usada
  createdAt: string;
  updatedAt: string;

  // ✅ Dados populados opcionais (vindos do backend com .populate())
  user?: {
    _id: string;
    username: string;
    email?: string;
  };

  court?: {
    _id: string;
    name: string;
  };
}

// ✅ DTO para criação de pagamentos
export interface PaymentCreateDTO {
  user_id: string;
  amount: number;
  method: string;
}
