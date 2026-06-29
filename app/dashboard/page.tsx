'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';
import { LogOut, Settings2, ClipboardList, BarChart3 } from 'lucide-react';
import type { OrderStatus } from '@/types';
import { useOrders } from '@/hooks/useOrders';
import { StatsBar } from '@/components/dashboard/StatsBar';
import { OrderCard } from '@/components/dashboard/OrderCard';
import { Analytics } from '@/components/dashboard/Analytics';
import { Spinner } from '@/components/ui/Spinner';
import { restaurantConfig } from '@/data/restaurant.config';
import { cn } from '@/utils/cn';

type Filter = 'Active' | OrderStatus | 'All';
const FILTERS: Filter[] = ['Active', 'New', 'Preparing', 'Served', 'Completed', 'Cancelled', 'All'];
const ACTIVE: OrderStatus[] = ['New', 'Preparing', 'Served'];

/**
 * Restaurant Order Panel — incoming orders with one-tap status flow
 * (New → Preparing → Served → Completed), plus a Revenue & Orders analytics
 * tab. Protected by login (see middleware.ts).
 */
export default function DashboardPage() {
  const router = useRouter();
  const { orders, loading, updateStatus } = useOrders();
  const [tab, setTab] = useState<'orders' | 'analytics'>('orders');
  const [filter, setFilter] = useState<Filter>('Active');

  const visible = useMemo(() => {
    if (filter === 'All') return orders;
    if (filter === 'Active') return orders.filter((o) => ACTIVE.includes(o.status));
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    router.replace('/login');
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-soft">{restaurantConfig.name}</p>
          <h1 className="font-display text-3xl">Order Panel</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-xl border border-hairline px-3 py-2 text-sm text-muted hover:text-gold"
          >
            <Settings2 size={16} /> Menu
          </Link>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-xl border border-hairline px-3 py-2 text-sm text-muted hover:text-nonveg"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 rounded-xl border border-hairline bg-surface p-1">
        {([['orders', 'Orders', ClipboardList], ['analytics', 'Analytics', BarChart3]] as const).map(
          ([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors',
                tab === key ? 'bg-gold text-black' : 'text-muted hover:text-ink',
              )}
            >
              <Icon size={16} /> {label}
            </button>
          ),
        )}
      </div>

      {loading ? (
        <div className="grid place-items-center py-24">
          <Spinner size={40} />
        </div>
      ) : tab === 'analytics' ? (
        <div className="mt-6">
          <Analytics orders={orders} />
        </div>
      ) : (
        <>
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
          {visible.length === 0 ? (
            <div className="mt-5 grid place-items-center rounded-2xl border border-dashed border-hairline py-24 text-center text-muted">
              <div>
                <p className="font-display text-xl">No orders here yet</p>
                <p className="mt-1 text-sm">New orders placed from the menu will appear here.</p>
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
        </>
      )}
    </div>
  );
}
