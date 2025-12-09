'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { User, ShieldCheck, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="border-t border-white/10">

          {/* Header */}
          <div className="flex flex-col items-center pt-8 pb-6">
            <motion.div
              className="relative w-32 h-32 mb-6 p-4 bg-white/5 rounded-full ring-1 ring-white/10 backdrop-blur-sm shadow-inner"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Image
                src="/images/logo.webp"
                alt="Logo Óticas Vizz"
                fill
                className="object-contain drop-shadow-lg"
              />
            </motion.div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-600 mb-2">
              Óticas Vizz
            </h1>
            <p className="text-slate-400 text-center text-sm px-6">
              Acompanhe a produção dos seus óculos em tempo real.
            </p>
          </div>

          {/* Actions */}
          <div className="p-6 space-y-4">
            <Link href="/login" className="block">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <div className="group border border-slate-700/50 bg-slate-800/40 hover:bg-slate-800/60 rounded-xl p-4 transition-all flex items-center gap-4 cursor-pointer">
                  <div className="bg-amber-500/20 p-3 rounded-lg text-amber-500 group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <span className="block font-bold text-slate-200">Sou Cliente</span>
                    <span className="text-xs text-slate-500 group-hover:text-slate-400">Acompanhar meu pedido com CPF</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
                </div>
              </motion.div>
            </Link>

            <Link href="/admin" className="block">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <div className="group border border-slate-700/50 bg-slate-800/40 hover:bg-slate-800/60 rounded-xl p-4 transition-all flex items-center gap-4 cursor-pointer">
                  <div className="bg-yellow-600/20 p-3 rounded-lg text-yellow-500 group-hover:bg-yellow-600 group-hover:text-white transition-colors">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <span className="block font-bold text-slate-200">Sou Gerente</span>
                    <span className="text-xs text-slate-500 group-hover:text-slate-400">Acesso administrativo</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
                </div>
              </motion.div>
            </Link>
          </div>

          <div className="bg-slate-950/30 p-4 text-center">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} Óticas Vizz - Sistema Seguro & Otimizado
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}