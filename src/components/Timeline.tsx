// src/components/Timeline.tsx
'use client'; // Framer motion needs client side

import React from 'react';
import { STATUS_LIST, Order } from '../utils/types';
import { motion } from 'framer-motion';
import { Check, Clock, Circle } from 'lucide-react';

interface TimelineProps {
  order: Order;
}

export default function Timeline({ order }: TimelineProps) {
  const currentIndex = STATUS_LIST.indexOf(order.currentStatus);

  return (
    <div className="w-full max-w-3xl mx-auto py-4">
      <h2 className="hidden md:block text-2xl font-bold mb-8 text-slate-100 pl-4 border-l-4 border-brand-primary">
        Status do Pedido <span className="text-brand-secondary">#{order.id}</span>
      </h2>

      <div className="relative ml-4 md:ml-6 space-y-8 my-4">
        {/* Linha vertical de fundo */}
        <div className="absolute left-[11px] top-2 bottom-4 w-[2px] bg-slate-800" />

        {STATUS_LIST.map((status, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const historyItem = order.history.find(h => h.status === status);

          return (
            <motion.div
              key={status}
              className="relative pl-10 md:pl-12"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Ícone do Status */}
              <div
                className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center z-10 transition-all duration-500 ${isCompleted
                  ? 'bg-amber-500 shadow-lg shadow-amber-500/50 scale-110'
                  : 'bg-slate-800 border-2 border-slate-700'
                  } ${isCurrent ? 'ring-4 ring-amber-500/30 bg-yellow-500' : ''}`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 text-slate-950" strokeWidth={3} />
                ) : (
                  <Circle className="w-3 h-3 text-slate-600" />
                )}
              </div>

              {/* Conteúdo */}
              <div className={`flex flex-col p-4 rounded-xl border transition-all duration-300 ${isCurrent
                ? 'bg-slate-800/50 border-amber-500/30 shadow-lg'
                : 'bg-transparent border-transparent'
                }`}>
                <span
                  className={`font-semibold text-base md:text-lg leading-tight flex items-center gap-2 ${isCompleted ? 'text-amber-500' : 'text-slate-500'
                    }`}
                >
                  {status}
                  {isCurrent && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-brand-secondary/10 text-brand-secondary">
                      Atual
                    </span>
                  )}
                </span>

                {historyItem && (
                  <div className="flex items-center mt-2 text-xs md:text-sm text-slate-400">
                    <Clock className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                    <span>{historyItem.date}</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div >
  );
}