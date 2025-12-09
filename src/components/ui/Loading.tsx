'use client';
import { motion } from 'framer-motion';

export const Loading = () => {
    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="relative w-16 h-16">
                <motion.span
                    className="absolute inset-0 rounded-full border-4 border-slate-700/30"
                />
                <motion.span
                    className="absolute inset-0 rounded-full border-4 border-t-brand-primary border-r-transparent border-b-transparent border-l-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
            </div>
            <p className="text-slate-400 text-sm animate-pulse">Carregando...</p>
        </div>
    );
};
