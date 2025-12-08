// src/app/login/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getOrders } from '../../utils/storage';
import Link from 'next/link';
import Image from 'next/image';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlId = searchParams.get('id') || '';

  const [orderId, setOrderId] = useState(urlId);
  const [cpf, setCpf] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (urlId) {
        setOrderId(urlId);
    }
  }, [urlId]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    setTimeout(() => {
        const currentOrders = getOrders();
        
        // Validação limpando caracteres especiais
        const cleanInputCpf = cpf.replace(/\D/g, '');

        const order = currentOrders.find(o => {
            const cleanStoredCpf = (o.cpf || '').replace(/\D/g, '');
            return o.id === orderId && cleanStoredCpf === cleanInputCpf;
        });

        if (order) {
            router.push(`/acompanhamento?id=${order.id}`);
        } else {
            setError('Dados incorretos. Verifique o ID do pedido e o CPF.');
            setLoading(false);
        }
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      
      {/* Lado Esquerdo - Visual (Branding) */}
      <div className="hidden md:flex md:w-1/2 bg-gray-900 justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gray-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gray-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10 text-center text-white flex flex-col items-center">
            {/* LOGO GRANDE */}
            <div className="relative w-48 h-48 mb-6 p-4">
                <Image 
                    src="/images/logo.webp" 
                    alt="Logo Óticas Vizz" 
                    fill
                    className="object-contain"
                />
            </div>
            
            <h1 className="text-4xl font-bold mb-4">Óticas Vizz</h1>
            <p className="text-blue-100 text-lg max-w-sm mx-auto">Acompanhe a produção dos seus óculos em tempo real com transparência total.</p>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center mb-8 md:hidden">
             {/* Logo Mobile */}
             <div className="relative w-20 h-20 mx-auto mb-2">
                <Image 
                    src="/images/logo.webp" 
                    alt="Logo Óticas Vizz" 
                    fill
                    className="object-contain"
                />
             </div>
             <h2 className="text-2xl font-bold text-blue-900">Óticas Vizz</h2>
          </div>
          
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Rastreamento</h2>
          <p className="text-gray-500 mb-8">Digite o número do pedido e seu CPF.</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número do Pedido</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none text-gray-900 placeholder-gray-400"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Ex: 1001"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CPF (apenas números)</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none text-gray-900 placeholder-gray-400"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="000.000.000-00"
              />
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Consultar' : 'Rastrear Meu Pedido'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
             <Link href="/" className="hover:text-blue-600 transition-colors">Voltar para o Início</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
            <LoginContent />
        </Suspense>
    )
}