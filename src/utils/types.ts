// src/utils/types.ts

export const STATUS_LIST = [
  "Coleta da armação solicitada",
  "Armação coletada na loja e encaminhada para o laboratório",
  "Analise dos dados e medidas da lente e armação",
  "Montagem",
  "Testes de lente",
  "Montagem finalizada",
  "Solicitada entrega na loja",
  "Óculos disponível para retirada",
  "Óculos entregue",
] as const;

export type StatusType = typeof STATUS_LIST[number];

export interface StatusHistory {
  status: StatusType;
  date: string;
}

export interface Order {
  id: string;
  customerName: string;
  cpf: string;
  currentStatus: StatusType;
  history: StatusHistory[];
  glassesModel?: string;
  lensType?: string;
  createdAt?: string;
}