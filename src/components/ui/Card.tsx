'use client';

import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    hoverEffect?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, hoverEffect = false, children, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                className={cn(
                    "glass-card p-6 overflow-hidden relative",
                    hoverEffect && "hover:border-slate-500/50 transition-colors cursor-pointer",
                    className
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                whileHover={hoverEffect ? { y: -5 } : undefined}
                {...props}
            >
                {children}

                {/* Glow Effect on Hover using pseudo-element logic in CSS or simple divs */}
                {hoverEffect && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
                )}
            </motion.div>
        );
    }
);
Card.displayName = 'Card';

export { Card };
