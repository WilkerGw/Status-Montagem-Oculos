// src/app/acompanhamento/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { Order } from '../../utils/types';
import Timeline from '../../components/Timeline';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';

function TrackingContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  const [order, setOrder] = useState<any | null>(null); // Use any temporário para evitar conflito de snake_case
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
        fetchOrder();
    }
  }, [id]);

  async function fetchOrder() {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) {
          // Mapeia snake_case do banco para camelCase do componente se necessário
          // Mas vamos adaptar o objeto para passar direto
          setOrder({
              ...data,
              customerName: data.customer_name,
              currentStatus: data.current_status
          });
      }
      setLoading(false);
  }

  if (loading) return <div className="min-h-screen flex justify-center items-center">Carregando...</div>;

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Header />
        <div className="mt-10 text-center">
            <h2 className="text-xl text-red-600 font-bold">Pedido não encontrado.</h2>
            <Link href="/login" className="text-blue-600 underline mt-4 block">Voltar</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <p className="text-sm text-gray-500 uppercase font-bold">Olá, {order.customerName}</p>
            <h1 className="text-2xl font-bold text-blue-900">Pedido #{order.id}</h1>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden p-6">
            <Timeline order={order} />
        </div>
        <div className="mt-8 text-center">
          <Link href="/login" className="text-gray-500 hover:text-blue-600 text-sm">&larr; Sair</Link>
        </div>
      </main>
    </div>
  );
}

export default function TrackingPage() {
    return <Suspense fallback={<div>Carregando...</div>}><TrackingContent /></Suspense>
}