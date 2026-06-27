'use client';

import { useMemo, useState } from 'react';
import { DishCard } from './DishCard';
import { CategoryTabs } from './CategoryTabs';
import { useDishStore } from '@/store/useDishStore';
import { useHydrated } from '@/hooks/useHydrated';
import type { Category } from '@/types';

/**
 * The full interactive menu: category filter + responsive card grid.
 * Reads dishes from the dish store (so Admin edits show up instantly).
 */
export function MenuGrid() {
  const dishes = useDishStore((s) => s.dishes);
  const hydrated = useHydrated();
  const [active, setActive] = useState<Category | 'All'>('All');

  const categories = useMemo<(Category | 'All')[]>(
    () => ['All', ...Array.from(new Set(dishes.map((d) => d.category)))],
    [dishes],
  );

  const visible = useMemo(
    () => (active === 'All' ? dishes : dishes.filter((d) => d.category === active)),
    [dishes, active],
  );

  // Render the static (default) menu on the server pass; client takes over after hydration.
  return (
    <div>
      <div className="sticky top-16 z-30 -mx-4 bg-bg/80 px-4 py-3 backdrop-blur-xl">
        <CategoryTabs categories={categories} active={active} onChange={setActive} />
      </div>

      <div className="grid grid-cols-1 gap-5 pt-6 sm:grid-cols-2 lg:grid-cols-3">
        {(hydrated ? visible : dishes).map((dish, i) => (
          <DishCard key={dish.id} dish={dish} index={i} />
        ))}
      </div>
    </div>
  );
}
