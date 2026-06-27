'use client';

import { Minus, Plus } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * Compact +/- quantity stepper used on dish cards and in the cart.
 * (lucide-react ships with Next; if you prefer, swap icons for text.)
 */
export function QuantitySelector({
  value,
  onChange,
  min = 1,
  size = 'md',
  className,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const dim = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-xl border border-hairline bg-elevated',
        className,
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, value - 1))}
        className={cn(dim, 'grid place-items-center text-ink/80 hover:text-gold')}
      >
        <Minus size={16} />
      </button>
      <span className="w-8 text-center text-sm font-semibold tabular-nums">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
        className={cn(dim, 'grid place-items-center text-ink/80 hover:text-gold')}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
