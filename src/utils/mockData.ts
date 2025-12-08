// src/utils/mockData.ts
import { Order } from './types';

export const initialOrders: Order[] = [
  {
    id: "1001",
    customerName: "João da Silva",
    cpf: "123.456.789-00", // CPF fictício
    currentStatus: "Analise dos dados e medidas da lente e armação",
    history: [
      { status: "Coleta da armação solicitada", date: "08/12/2023 10:00" },
      { status: "Armação coletada na loja e encaminhada para o laboratório", date: "08/12/2023 14:30" },
      { status: "Analise dos dados e medidas da lente e armação", date: "09/12/2023 09:15" },
    ],
  },
];