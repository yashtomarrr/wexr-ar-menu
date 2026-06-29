'use client';

import { motion } from 'framer-motion';
import { Clock, Phone, User } from 'lucide-react';
import type { Order, OrderStatus } from '@/types';
import { cn } from '@/utils/cn';
import { formatPrice, shortId, timeAgo } from '@/utils/format';

/** Next status in the kitchen flow (the primary action button advances it). */
const NEXT: Partial<Record<OrderStatus, OrderStatus>> = {
  New: 'Preparing',
  Preparing: 'Served',
  Served: 'Completed',
};

const STATUS_STYLE: Record<OrderStatus, string> = {
  New: 'bg-gold/15 text-gold ring-gold/30',
  Preparing: 'bg-blue-500/15 text-blue-300 ring-blue-400/30',
  Served: 'bg-veg/15 text-veg ring-veg/30',
  Completed: 'bg-white/10 text-muted ring-white/15',
  Cancelled: 'bg-nonveg/15 text-nonveg ring-nonveg/30',
};

export function OrderCard({
  order,
  onStatus,
}: {
  order: Order;
  onStatus: (id: string, status: OrderStatus) => void;
}) {
  const next = NEXT[order.status];
  const closed = order.status === 'Completed' || order.status === 'Cancelled';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col rounded-2xl border border-hairline bg-surface p-4"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm font-semibold text-gold">{shortId(order.id)}</span>
        <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1', STATUS_STYLE[order.status])}>
          {order.status}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        <span className="inline-flex items-center gap-1"><User size={12} /> {order.customer.name}</span>
        <span className="inline-flex items-center gap-1"><Phone size={12} /> {order.customer.phone}</span>
        <span className="inline-flex items-center gap-1">🪑 Table {order.customer.table}</span>
        <span className="inline-flex items-center gap-1"><Clock size={12} /> {timeAgo(order.createdAt)}</span>
      </div>

      <ul className="mt-3 space-y-1 border-y border-hairline py-3 text-sm">
        {order.items.map((i) => (
          <li key={i.dishId} className="flex justify-between">
            <span className="text-ink/90">
              <span className="text-gold">{i.quantity}×</span> {i.name}
            </span>
            <span className="text-muted">{formatPrice(i.price * i.quantity)}</span>
          </li>
        ))}
      </ul>

      {order.customer.notes && (
        <p className="mt-2 rounded-lg bg-elevated px-3 py-2 text-xs italic text-muted">
          “{order.customer.notes}”
        </p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <span className="font-display text-xl text-gold">{formatPrice(order.total)}</span>
        {!closed && (
          <div className="flex gap-2">
            <button
              onClick={() => onStatus(order.id, 'Cancelled')}
              className="rounded-lg border border-nonveg/40 px-3 py-1.5 text-xs text-nonveg hover:bg-nonveg/10"
            >
              Cancel
            </button>
            {next && (
              <button
                onClick={() => onStatus(order.id, next)}
                className="rounded-lg bg-gradient-to-b from-gold to-gold-soft px-3 py-1.5 text-xs font-semibold text-black"
              >
                Mark {next}
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
