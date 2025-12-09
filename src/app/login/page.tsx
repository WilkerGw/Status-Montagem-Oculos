'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlId = searchParams.get('id') || '';

  const [orderId, setOrderId] = useState(urlId);
  const [cpf, setCpf] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (urlId) setOrderId(urlId);
  }, [urlId]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Formatar CPF digitado para garantir comparação correta
      const cleanInputCpf = cpf
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');

      // Busca no Supabase (Filtrando por ID e CPF)
      const { data, error } = await supabase
        .from('orders')
        .select('id')
        .eq('id', orderId)
        .eq('cpf', cleanInputCpf)
        .single();

      if (error || !data) {
        setError('Dados incorretos. Verifique ID e CPF.');
      } else {
        router.push(`/acompanhamento?id=${orderId}`);
      }
    } catch (err) {
      setError('Ocorreu um erro ao buscar o pedido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/20 rounded-full mix-blend-overlay filter blur-[100px] animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-600/20 rounded-full mix-blend-overlay filter blur-[100px] animate-blob animation-delay-2000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Button
          variant="ghost"
          className="mb-6 -ml-2 text-slate-400 hover:text-white"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </Button>

        <Card className="shadow-2xl border-t border-white/10 p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-amber-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/20"
            >
              <Search className="w-8 h-8 text-amber-500" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">Rastrear Pedido</h2>
            <p className="text-slate-400">Digite o número do pedido e seu CPF</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="orderId" className="text-sm font-medium text-slate-300 ml-1">Número do Pedido</label>
              <Input
                id="orderId"
                type="text"
                placeholder="Ex: 12345"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="bg-slate-900/50 focus:border-amber-500 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="cpf" className="text-sm font-medium text-slate-300 ml-1">CPF do Titular</label>
              <Input
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="bg-slate-900/50 focus:border-amber-500 focus:ring-amber-500"
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-3 text-red-200 text-sm"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              size="lg"
              className="w-full text-base font-semibold mt-2 font-bold shadow-amber-500/20"
              disabled={!cpf || !orderId || loading}
              isLoading={loading}
              variant="primary"
            >
              {loading ? "Verificando..." : "Rastrear"}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Carregando...</div>}>
      <LoginContent />
    </Suspense>
  );
}
