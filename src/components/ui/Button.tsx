'use client';

import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {

        // Configurações de estilo base
        const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95';

        // Variantes de cor
        // Variantes de cor
        const variants = {
            primary: 'bg-brand-primary text-slate-950 hover:bg-amber-400 shadow-lg shadow-amber-500/30 border border-transparent font-bold',
            secondary: 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700',
            outline: 'bg-transparent border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white',
            ghost: 'bg-transparent text-slate-400 hover:text-white hover:bg-slate-800/50',
            danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/30 border border-transparent',
        };

        // Tamanhos
        const sizes = {
            sm: 'h-9 px-4 text-sm',
            md: 'h-11 px-6 text-base',
            lg: 'h-14 px-8 text-lg',
        };

        return (
            <motion.button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {children}
            </motion.button>
        );
    }
);
Button.displayName = 'Button';

export { Button };
