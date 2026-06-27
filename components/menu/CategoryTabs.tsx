'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import type { Category } from '@/types';

/** Horizontal, scrollable category filter with an animated gold underline. */
export function CategoryTabs({
  categories,
  active,
  onChange,
}: {
  categories: (Category | 'All')[];
  active: Category | 'All';
  onChange: (c: Category | 'All') => void;
}) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 pb-1">
      {categories.map((c) => {
        const isActive = c === active;
        return (
          <button
            key={c}
            onClick={() => onChange(c)}
            className={cn(
              'relative whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors',
              isActive ? 'text-black' : 'text-muted hover:text-ink',
            )}
          >
            {isActive && (
              <motion.span
                layoutId="category-pill"
                className="absolute inset-0 rounded-full bg-gradient-to-b from-gold to-gold-soft"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10 font-medium">{c}</span>
          </button>
        );
      })}
    </div>
  );
}
