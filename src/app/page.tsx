// src/app/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex flex-col items-center justify-center p-4">
      
      {/* Círculos decorativos */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-gray-400 opacity-10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header do Card */}
        <div className="bg-gray-700 p-8 text-center border-b border-blue-100 flex flex-col items-center">
          <div className="relative w-24 h-24 mb-4 p-2">
             <Image 
                src="/images/logo.webp" 
                alt="Logo Óticas Vizz" 
                fill
                className="object-contain"
             />
          </div>
          <p className="text-gray-300 mt-2 font-medium">Bem-vindo ao nosso portal</p>
        </div>

        {/* Corpo com Botões */}
        <div className="p-8 space-y-4">
            <p className="text-gray-500 text-center mb-6">Por favor, selecione como deseja acessar:</p>

            <Link href="/login" className="block group">
                <div className="border border-gray-200 rounded-xl p-4 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full text-gray-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div>
                        <span className="block font-bold text-gray-600"> Cliente</span>
                        <span className="text-sm text-gray-500">Acompanhar meu pedido</span>
                    </div>
                </div>
            </Link>

            <Link href="/admin" className="block group">
                <div className="border border-gray-200 rounded-xl p-4 hover:border-gray-800 hover:bg-gray-50 transition-all flex items-center gap-4">
                    <div className="bg-gray-100 p-3 rounded-full text-gray-600 group-hover:bg-gray-800 group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                    </div>
                    <div>
                        <span className="block font-bold text-gray-600"> Gerente</span>
                        <span className="text-sm text-gray-500">Gerenciar pedidos</span>
                    </div>
                </div>
            </Link>
        </div>

        <div className="bg-gray-50 p-4 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Óticas Vizz - Sistema Seguro
        </div>
      </div>
    </div>
  );
}