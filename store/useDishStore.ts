import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Dish } from '@/types';
import { menu as defaultMenu } from '@/data/menu';

/**
 * Dish store powering the Admin panel (add / edit / delete / availability).
 * Seeds from data/menu.ts and persists edits to localStorage, so a
 * restaurant owner can manage the menu with NO code changes.
 * Call `resetToDefault()` to restore the shipped sample menu.
 */
interface DishState {
  dishes: Dish[];
  upsert: (dish: Dish) => void;
  remove: (id: string) => void;
  toggleAvailable: (id: string) => void;
  resetToDefault: () => void;
  get: (id: string) => Dish | undefined;
}

export const useDishStore = create<DishState>()(
  persist(
    (set, get) => ({
      dishes: defaultMenu,

      upsert: (dish) =>
        set((state) => {
          const exists = state.dishes.some((d) => d.id === dish.id);
          return {
            dishes: exists
              ? state.dishes.map((d) => (d.id === dish.id ? dish : d))
              : [...state.dishes, dish],
          };
        }),

      remove: (id) =>
        set((state) => ({ dishes: state.dishes.filter((d) => d.id !== id) })),

      toggleAvailable: (id) =>
        set((state) => ({
          dishes: state.dishes.map((d) =>
            d.id === id ? { ...d, available: !(d.available ?? true) } : d,
          ),
        })),

      resetToDefault: () => set({ dishes: defaultMenu }),

      get: (id) => get().dishes.find((d) => d.id === id),
    }),
    { name: 'wexr_dishes_v1' },
  ),
);
