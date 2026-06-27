'use client';

import { useMemo } from 'react';
import { IndianRupee, ClipboardList, Flame } from 'lucide-react';
import type { Order } from '@/types';
import { formatPrice } from '@/utils/format';

/**
 * Top-of-dashboard KPI strip: revenue today, active orders and the most
 * popular item — all derived live from the orders list.
 */
export function StatsBar({ orders }: { orders: Order[] }) {
  const stats = useMemo(() => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const today = orders.filter((o) => o.createdAt >= startOfDay.getTime());

    const revenue = today
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const active = orders.filter((o) =>
      ['Pending', 'Preparing', 'Ready'].includes(o.status),
    ).length;

    const counts = new Map<string, number>();
    today.forEach((o) =>
      o.items.forEach((i) => counts.set(i.name, (counts.get(i.name) ?? 0) + i.quantity)),
    );
    const popular = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

    return { revenue, active, popular, total: today.length };
  }, [orders]);

  const cards = [
    { label: "Revenue Today", value: formatPrice(stats.revenue), icon: IndianRupee },
    { label: 'Active Orders', value: String(stats.active), icon: ClipboardList },
    { label: 'Orders Today', value: String(stats.total), icon: ClipboardList },
    { label: 'Popular Item', value: stats.popular, icon: Flame },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-2xl border border-hairline bg-surface p-4">
          <div className="flex items-center gap-2 text-muted">
            <c.icon size={15} className="text-gold" />
            <span className="text-xs uppercase tracking-wide">{c.label}</span>
          </div>
          <p className="mt-2 truncate font-display text-2xl text-ink">{c.value}</p>
        </div>
      ))}
    </div>
  );
}
