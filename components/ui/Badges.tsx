import { cn } from '@/utils/cn';
import type { SpiceLevel } from '@/types';

/** Veg / Non-veg indicator (the classic Indian square-with-dot mark). */
export function VegBadge({ veg, className }: { veg: boolean; className?: string }) {
  const color = veg ? 'var(--veg)' : 'var(--nonveg)';
  return (
    <span
      aria-label={veg ? 'Vegetarian' : 'Non-vegetarian'}
      className={cn('inline-flex h-4 w-4 items-center justify-center rounded-[3px] border-[1.5px]', className)}
      style={{ borderColor: `rgb(${color})` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: `rgb(${color})` }} />
    </span>
  );
}

/** Gold "Best Seller" pill. */
export function BestSellerBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold ring-1 ring-gold/30',
        className,
      )}
    >
      ★ Best Seller
    </span>
  );
}

/** Spice level shown as little chili icons. */
export function SpiceBadge({ level }: { level: SpiceLevel }) {
  if (level === 'None') return null;
  const count = level === 'Mild' ? 1 : level === 'Medium' ? 2 : 3;
  return (
    <span
      title={`${level} spice`}
      className="inline-flex items-center gap-0.5 text-xs text-nonveg"
      aria-label={`${level} spice level`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <span key={i}>🌶</span>
      ))}
    </span>
  );
}
