// src/components/Timeline.tsx
import React from 'react';
import { STATUS_LIST, Order } from '../utils/types';

interface TimelineProps {
  order: Order;
}

export default function Timeline({ order }: TimelineProps) {
  const currentIndex = STATUS_LIST.indexOf(order.currentStatus);

  return (
    <div className="w-full max-w-2xl mx-auto p-2 md:p-4"> {/* Menos padding no mobile */}
      {/* Esconde o título no mobile para economizar espaço, já tem no header da página */}
      <h2 className="hidden md:block text-xl font-bold mb-6 text-gray-800">Status do Pedido #{order.id}</h2>
      
      {/* Ajuste na margem esquerda (ml-3 vs ml-4) e espaçamento vertical */}
      <div className="relative border-l-4 border-gray-200 ml-3 md:ml-4 space-y-6 md:space-y-8 my-4">
        {STATUS_LIST.map((status, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const historyItem = order.history.find(h => h.status === status);

          return (
            <div key={status} className="relative pl-6 md:pl-8">
              {/* Bolinha indicador - Ajustada posição para alinhar com linha */}
              <div
                className={`absolute -left-[14px] top-1 w-6 h-6 rounded-full border-4 transition-all duration-300 ${
                  isCompleted ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'
                } ${isCurrent ? 'ring-4 ring-green-200 scale-110' : ''}`}
              ></div>

              {/* Texto do Status */}
              <div className="flex flex-col">
                <span
                  className={`font-semibold text-base md:text-lg leading-tight ${
                    isCompleted ? 'text-gray-800' : 'text-gray-400'
                  }`}
                >
                  {status}
                </span>
                
                {/* Data - Fonte menor no mobile */}
                {historyItem && (
                  <span className="text-xs md:text-sm text-green-600 font-medium mt-1">
                    {historyItem.date}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}