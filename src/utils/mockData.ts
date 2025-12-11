// src/utils/mockData.ts
import { Order } from './types';

export const initialOrders: Order[] = [
  {
    id: "1001",
    customerName: "João da Silva",
    cpf: "123.456.789-00", // CPF fictício
    currentStatus: "Triagem / Conferência",
    history: [
      { status: "Aguardando Coleta", date: "08/12/2023 10:00" },
      { status: "Armação em Trânsito (Ida)", date: "08/12/2023 14:30" },
      { status: "Triagem / Conferência", date: "09/12/2023 09:15" },
    ],
  },
];