// src/app/acompanhamento/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { getOrders } from '../../utils/storage'; // CORREÇÃO: Usar getOrders
import { Order } from '../../utils/types';
import Timeline from '../../components/Timeline';
import Header from '../../components/Header';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';

function TrackingContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  // Usamos estado local porque a leitura do localStorage deve ser feita no cliente
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
        const allOrders = getOrders();
        const found = allOrders.find((o) => o.id === id);
        setOrder(found || null);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Carregando...</div>;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
            <div className="text-red-500 mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Pedido não encontrado</h2>
            <p className="text-gray-600 mb-6">Verifique se o link está correto ou faça login novamente.</p>
            <Link href="/login" className="inline-block w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Voltar ao Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Olá, {order.customerName}</p>
              <h1 className="text-2xl font-bold text-blue-900 mt-1">Acompanhamento do Pedido #{order.id}</h1>
            </div>
            <div className="text-right hidden md:block">
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Em andamento
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-blue-50 p-4 border-b border-blue-100">
            <h2 className="font-semibold text-blue-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Linha do Tempo
            </h2>
          </div>
          <div className="p-6">
            <Timeline order={order} />
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/login" className="text-gray-500 hover:text-blue-600 font-medium text-sm transition-colors">
            &larr; Sair e voltar ao login
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function TrackingPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <TrackingContent />
        </Suspense>
    )
}