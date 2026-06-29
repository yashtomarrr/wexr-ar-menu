'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { useHydrated } from '@/hooks/useHydrated';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { backend } from '@/services';
import { formatPrice } from '@/utils/format';
import { uid } from '@/utils/id';
import type { CustomerInfo, Order } from '@/types';

/**
 * Checkout: customer details + order summary. Submits to the active backend
 * (local or Supabase) and redirects to the confirmation page. The restaurant
 * dashboard receives the order live.
 */
export default function CheckoutPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const { lines, total, clear } = useCartStore();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CustomerInfo>({ name: '', phone: '', table: '', notes: '' });

  const sum = total();
  const valid = form.name.trim() && form.phone.trim() && form.table.trim() && lines.length > 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setSubmitting(true);

    const order: Order = {
      id: uid(),
      createdAt: Date.now(),
      status: 'New',
      items: lines,
      customer: form,
      total: sum,
    };

    try {
      await backend.createOrder(order);
      clear();
      router.push(`/order-confirmation/${order.id}`);
    } catch (err) {
      console.error(err);
      alert('Could not place order. Please try again.');
      setSubmitting(false);
    }
  }

  if (hydrated && lines.length === 0) {
    return (
      <div className="grid min-h-[60vh] place-items-center px-6 text-center">
        <div>
          <p className="font-display text-2xl">Your cart is empty</p>
          <Button className="mt-4" onClick={() => router.push('/menu')}>
            Browse the menu
          </Button>
        </div>
      </div>
    );
  }

  const field =
    'w-full rounded-xl border border-hairline bg-elevated px-4 py-3 text-ink placeholder:text-muted/60 outline-none focus:border-gold/50';

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl">Checkout</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Customer form */}
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={submit}
          className="space-y-4"
        >
          <div>
            <label className="mb-1.5 block text-sm text-muted">Name *</label>
            <input
              className={field}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm text-muted">Phone *</label>
              <input
                className={field}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="10-digit number"
                inputMode="tel"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-muted">Table Number *</label>
              <input
                className={field}
                value={form.table}
                onChange={(e) => setForm({ ...form, table: e.target.value })}
                placeholder="e.g. 12"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-muted">Special Instructions</label>
            <textarea
              className={`${field} min-h-24 resize-none`}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Allergies, less spicy, no onion…"
            />
          </div>

          <Button type="submit" size="lg" fullWidth disabled={!valid || submitting}>
            {submitting ? <Spinner size={20} /> : `Place Order · ${formatPrice(sum)}`}
          </Button>
        </motion.form>

        {/* Order summary */}
        <aside className="h-fit rounded-2xl border border-hairline bg-surface p-5">
          <h2 className="font-display text-xl">Order Summary</h2>
          <ul className="mt-4 space-y-3">
            {lines.map((l) => (
              <li key={l.dishId} className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-elevated">
                  <Image src={l.image} alt={l.name} fill sizes="48px" className="object-cover" />
                </div>
                <div className="flex-1 text-sm">
                  <p className="leading-tight">{l.name}</p>
                  <p className="text-muted">×{l.quantity}</p>
                </div>
                <span className="text-sm text-gold">{formatPrice(l.price * l.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-center justify-between border-t border-hairline pt-4">
            <span className="text-muted">Total</span>
            <span className="font-display text-2xl text-gold">{formatPrice(sum)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
