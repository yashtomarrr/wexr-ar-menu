'use client';

import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

/**
 * Premium button with gold "primary", outline "ghost" and subtle "secondary"
 * variants. Includes a tasteful press/hover micro-interaction via Framer Motion.
 */
type Variant = 'primary' | 'ghost' | 'secondary' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-b from-gold to-gold-soft text-black font-semibold shadow-gold-glow hover:brightness-110',
  secondary:
    'bg-elevated text-ink border border-hairline hover:border-gold/40',
  ghost:
    'bg-transparent text-gold border border-gold/40 hover:bg-gold/10',
  danger:
    'bg-transparent text-nonveg border border-nonveg/40 hover:bg-nonveg/10',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm rounded-xl',
  md: 'h-11 px-5 text-[15px] rounded-xl',
  lg: 'h-13 px-7 text-base rounded-2xl py-3.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth, className, ...props }, ref) => (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-colors select-none disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = 'Button';
