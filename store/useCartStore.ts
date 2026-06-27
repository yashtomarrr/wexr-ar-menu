import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartLine, Dish } from '@/types';

/**
 * Cart store (Zustand, persisted to localStorage).
 * Holds line items and exposes derived totals + a drawer open/close flag.
 */
interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  add: (dish: Dish, qty?: number) => void;
  setQty: (dishId: string, qty: number) => void;
  remove: (dishId: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  // selectors
  count: () => number;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,

      add: (dish, qty = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => l.dishId === dish.id);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.dishId === dish.id ? { ...l, quantity: l.quantity + qty } : l,
              ),
            };
          }
          return {
            lines: [
              ...state.lines,
              {
                dishId: dish.id,
                name: dish.name,
                price: dish.price,
                image: dish.image,
                quantity: qty,
              },
            ],
          };
        }),

      setQty: (dishId, qty) =>
        set((state) => ({
          lines:
            qty <= 0
              ? state.lines.filter((l) => l.dishId !== dishId)
              : state.lines.map((l) =>
                  l.dishId === dishId ? { ...l, quantity: qty } : l,
                ),
        })),

      remove: (dishId) =>
        set((state) => ({
          lines: state.lines.filter((l) => l.dishId !== dishId),
        })),

      clear: () => set({ lines: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),

      count: () => get().lines.reduce((n, l) => n + l.quantity, 0),
      total: () => get().lines.reduce((s, l) => s + l.price * l.quantity, 0),
    }),
    { name: 'wexr_cart_v1' },
  ),
);
