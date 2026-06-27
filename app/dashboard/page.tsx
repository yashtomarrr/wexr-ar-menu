'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Radio } from 'lucide-react';
import type { OrderStatus } from '@/types';
import { useOrders } from '@/hooks/useOrders';
import { StatsBar } from '@/components/dashboard/StatsBar';
import { OrderCard } from '@/components/dashboard/OrderCard';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/utils/cn';

type Filter = 'Active' | OrderStatus | 'All';
const FILTERS: Filter[] = ['Active', 'Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled', 'All'];
const ACTIVE: OrderStatus[] = ['Pending', 'Preparing', 'Ready'];

/**
 * Restaurant dashboard — live incoming orders with one-tap status flow,
 * KPI strip and history. Updates in real time (cross-tab locally, or via
 * Supabase realtime when configured).
 */
export default function DashboardPage() {
  const { orders, loading, updateStatus } = useOrders();
  const [filter, setFilter] = useState<Filter>('Active');

  const visible = useMemo(() => {
    if (filter === 'All') return orders;
    if (filter === 'Active') return orders.filter((o) => ACTIVE.includes(o.status));
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Kitchen Dashboard</h1>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-veg/30 bg-veg/10 px-3 py-1.5 text-xs text-veg">
          <Radio size={13} className="animate-pulse" /> Live
        </span>
      </div>

      <div className="mt-6">
        <StatsBar orders={orders} />
      </div>

      {/* Filters */}
      <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => {
          const n =
            f === 'All'
              ? orders.length
              : f === 'Active'
                ? orders.filter((o) => ACTIVE.includes(o.status)).length
                : orders.filter((o) => o.status === f).length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors',
                filter === f
                  ? 'border-gold/50 bg-gold/15 text-gold'
                  : 'border-hairline text-muted hover:text-ink',
              )}
            >
              {f} <span className="opacity-60">({n})</span>
            </button>
          );
        })}
      </div>

      {/* Orders */}
      {loading ? (
        <div className="grid place-items-center py-24">
          <Spinner size={40} />
        </div>
      ) : visible.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-hairline py-24 text-center text-muted">
          <div>
            <p className="font-display text-xl">No orders here yet</p>
            <p className="mt-1 text-sm">
              Place an order from the menu (in another tab) to watch it appear live.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((o) => (
              <OrderCard key={o.id} order={o} onStatus={updateStatus} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
