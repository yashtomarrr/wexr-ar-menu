'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useHydrated } from '@/hooks/useHydrated';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/utils/format';

/**
 * Slide-in cart drawer. Mounted once in the root layout and driven by the
 * Zustand cart store, so any "Add" button anywhere opens/updates it.
 */
export function CartDrawer() {
  const router = useRouter();
  const { isOpen, close, lines, setQty, total } = useCartStore();
  const hydrated = useHydrated();
  const sum = total();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-hairline bg-surface"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          >
            <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
              <h2 className="font-display text-xl">Your Order</h2>
              <button onClick={close} aria-label="Close cart" className="text-muted hover:text-ink">
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {!hydrated ? null : lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted">
                  <ShoppingBag size={40} className="opacity-40" />
                  <p>Your cart is empty.</p>
                  <Button variant="ghost" size="sm" onClick={() => { close(); router.push('/menu'); }}>
                    Browse the menu
                  </Button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {lines.map((l) => (
                    <li key={l.dishId} className="flex gap-3">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-elevated">
                        <Image src={l.image} alt={l.name} fill sizes="64px" className="object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <span className="text-sm font-medium leading-tight">{l.name}</span>
                          <span className="text-sm font-semibold text-gold">{formatPrice(l.price * l.quantity)}</span>
                        </div>
                        <div className="mt-auto pt-2">
                          <QuantitySelector size="sm" value={l.quantity} min={0} onChange={(q) => setQty(l.dishId, q)} />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {hydrated && lines.length > 0 && (
              <div className="border-t border-hairline px-5 py-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-muted">Total</span>
                  <span className="font-display text-2xl text-gold">{formatPrice(sum)}</span>
                </div>
                <Button
                  fullWidth
                  size="lg"
                  onClick={() => {
                    close();
                    router.push('/checkout');
                  }}
                >
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
