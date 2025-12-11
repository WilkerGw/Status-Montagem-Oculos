// src/app/acompanhamento/page.tsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { Order, getNormalizedStatus } from '../../utils/types';
import Timeline from '../../components/Timeline';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { ArrowLeft, Package, User, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

function AcompanhamentoContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // Pegamos o ID da URL
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError('ID do pedido não fornecido.');
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        // Map database fields (snake_case) to our Order type (camelCase)
        // We use 'any' cast on data temporarily to access snake_case properties comfortably if TS complains
        const orderData = data as any;

        const formattedOrder: Order = {
          id: orderData.id,
          customerName: orderData.customer_name || orderData.customerName,
          cpf: orderData.cpf,
          currentStatus: getNormalizedStatus(orderData.current_status || orderData.currentStatus || ''),
          history: (orderData.history || []).map((h: any) => ({ ...h, status: getNormalizedStatus(h.status) })),
          glassesModel: orderData.glasses_model || orderData.glassesModel || 'Modelo Padrão',
          lensType: orderData.lens_type || orderData.lensType || 'Lente Padrão',
          createdAt: orderData.created_at || orderData.createdAt,
        };

        setOrder(formattedOrder);
      } catch (err) {
        console.error("Erro ao buscar pedido:", err);
        setError('Pedido não encontrado.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-8 space-y-4">
          <div className="bg-red-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
            <Package className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Ops!</h2>
          <p className="text-slate-400">{error || 'Pedido não encontrado.'}</p>
          <Button onClick={() => router.push('/login')} variant="secondary" className="w-full">
            Tentar Novamente
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 pb-20 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Button
          variant="ghost"
          onClick={() => router.push('/login')}
          className="text-slate-400 hover:text-white -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </Button>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Coluna da Esquerda: Detalhes do Pedido */}
        <div className="md:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full border-t-4 border-t-brand-primary">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-1">Olá, {order.customerName?.split(' ')[0]}</h1>
                <p className="text-slate-400 text-sm">Acompanhe o progresso do seu óculos.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
                  <Package className="w-5 h-5 text-brand-secondary mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Modelo</p>
                    <p className="text-slate-200 font-medium">{order.glassesModel}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
                  <Calendar className="w-5 h-5 text-brand-secondary mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Data do Pedido</p>
                    <p className="text-slate-200 font-medium">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('pt-BR') : 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
                  <User className="w-5 h-5 text-brand-secondary mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Lente</p>
                    <p className="text-slate-200 font-medium">{order.lensType}</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Coluna da Direita: Timeline */}
        <div className="md:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="min-h-[500px]">
              <Timeline order={order} />
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function AcompanhamentoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loading /></div>}>
      <AcompanhamentoContent />
    </Suspense>
  );
}