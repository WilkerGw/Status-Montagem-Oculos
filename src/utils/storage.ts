// src/utils/storage.ts
import { Order } from './types';
import { initialOrders } from './mockData';

const STORAGE_KEY = 'otica_orders_db';

// Função para buscar os pedidos
export const getOrders = (): Order[] => {
  if (typeof window === 'undefined') return initialOrders; // Segurança para o servidor

  const stored = localStorage.getItem(STORAGE_KEY);
  
  // Se não existir nada salvo, retorna os dados iniciais do mockData
  if (!stored) {
    return initialOrders;
  }

  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error("Erro ao ler dados:", error);
    return initialOrders;
  }
};

// Função para salvar os pedidos
export const saveOrders = (orders: Order[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }
};