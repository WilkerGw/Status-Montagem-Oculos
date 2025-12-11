// src/utils/types.ts

// Mapeamento de status antigos para novos para retrocompatibilidade
export const STATUS_MAPPING: Record<string, string> = {
  "Coleta da armação solicitada": "Aguardando Coleta",
  "Armação coletada na loja e encaminhada para o laboratório": "Armação em Trânsito (Ida)",
  "Analise dos dados e medidas da lente e armação": "Triagem / Conferência",
  "Montagem": "Em Montagem",
  "Testes de lente": "Controle de Qualidade",
  "Montagem finalizada": "Laboratório Finalizado",
  "Solicitada entrega na loja": "Em Trânsito para Loja",
  "Óculos disponível para retirada": "Disponível para Retirada",
  "Óculos entregue": "Entregue"
};

export const STATUS_LIST = [
  "Aguardando Coleta",
  "Armação em Trânsito (Ida)",
  "Triagem / Conferência",
  "Em Montagem",
  "Controle de Qualidade",
  "Laboratório Finalizado",
  "Em Trânsito para Loja",
  "Disponível para Retirada",
  "Entregue",
] as const;

export type StatusType = typeof STATUS_LIST[number];

// Helper para normalizar status (converte antigo para novo se necessário)
export function getNormalizedStatus(status: string): StatusType {
  // Se for um status antigo conhecido, retorna o novo
  if (status in STATUS_MAPPING) {
    return STATUS_MAPPING[status] as StatusType;
  }

  // Se já for um status novo válido, retorna ele mesmo
  if (STATUS_LIST.includes(status as StatusType)) {
    return status as StatusType;
  }

  // Fallback padrão para o primeiro status se não reconhecer
  return STATUS_LIST[0];
}

export interface StatusHistory {
  status: string; // Pode vir string antiga do banco
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