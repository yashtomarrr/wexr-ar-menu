'use client';

import { useMemo } from 'react';
import { IndianRupee, Receipt, CalendarDays, TrendingUp, Flame, CheckCheck } from 'lucide-react';
import type { Order } from '@/types';
import { formatPrice } from '@/utils/format';

/**
 * Revenue & orders analytics — pure derivation from the order list (no backend
 * calls). Gives the restaurant transparent daily/monthly numbers:
 * orders today, orders this month, revenue this month, all-time totals,
 * the most popular item, and a per-day revenue breakdown for the current month.
 *
 * Revenue counts every order that wasn't Cancelled (i.e. money taken in).
 */
export function Analytics({ orders }: { orders: Order[] }) {
  const a = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now); startOfToday.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    const counted = orders.filter((o) => o.status !== 'Cancelled');

    const today = counted.filter((o) => o.createdAt >= startOfToday.getTime());
    const month = counted.filter((o) => o.createdAt >= startOfMonth.getTime());

    const revenueMonth = month.reduce((s, o) => s + o.total, 0);
    const revenueToday = today.reduce((s, o) => s + o.total, 0);
    const revenueAll = counted.reduce((s, o) => s + o.total, 0);
    const completed = orders.filter((o) => o.status === 'Completed').length;
    const avg = counted.length ? Math.round(revenueAll / counted.length) : 0;

    // most popular item this month
    const itemCounts = new Map<string, number>();
    month.forEach((o) =>
      o.items.forEach((i) => itemCounts.set(i.name, (itemCounts.get(i.name) ?? 0) + i.quantity)),
    );
    const popular = [...itemCounts.entries()].sort((x, y) => y[1] - x[1])[0];

    // per-day revenue for current month
    const daily = Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1, revenue: 0, count: 0 }));
    month.forEach((o) => {
      const d = new Date(o.createdAt).getDate();
      daily[d - 1].revenue += o.total;
      daily[d - 1].count += 1;
    });
    const maxRevenue = Math.max(1, ...daily.map((d) => d.revenue));
    const monthLabel = now.toLocaleString('en-IN', { month: 'long', year: 'numeric' });

    return {
      revenueMonth, revenueToday, revenueAll, completed, avg, popular,
      ordersToday: today.length, ordersMonth: month.length, ordersAll: counted.length,
      daily, maxRevenue, monthLabel, todayIndex: now.getDate() - 1,
    };
  }, [orders]);

  const kpis = [
    { label: 'Revenue This Month', value: formatPrice(a.revenueMonth), icon: IndianRupee, hi: true },
    { label: 'Orders This Month', value: String(a.ordersMonth), icon: CalendarDays },
    { label: 'Orders Today', value: String(a.ordersToday), icon: Receipt },
    { label: "Revenue Today", value: formatPrice(a.revenueToday), icon: TrendingUp },
    { label: 'Avg Order Value', value: formatPrice(a.avg), icon: IndianRupee },
    { label: 'Completed Orders', value: String(a.completed), icon: CheckCheck },
    { label: 'All-time Revenue', value: formatPrice(a.revenueAll), icon: IndianRupee },
    { label: 'Popular Item', value: a.popular ? a.popular[0] : '—', icon: Flame },
  ];

  return (
    <div className="space-y-6">
      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className={
              'rounded-2xl border p-4 ' +
              (k.hi ? 'border-gold/40 bg-gold/10' : 'border-hairline bg-surface')
            }
          >
            <div className="flex items-center gap-2 text-muted">
              <k.icon size={15} className="text-gold" />
              <span className="text-xs uppercase tracking-wide">{k.label}</span>
            </div>
            <p className="mt-2 truncate font-display text-2xl text-ink">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Daily revenue breakdown for the month */}
      <div className="rounded-2xl border border-hairline bg-surface p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl">Daily Revenue</h3>
          <span className="text-xs text-muted">{a.monthLabel}</span>
        </div>

        <div className="flex h-44 items-end gap-[3px] overflow-x-auto pb-1">
          {a.daily.map((d, i) => {
            const h = Math.round((d.revenue / a.maxRevenue) * 100);
            const isToday = i === a.todayIndex;
            return (
              <div key={d.day} className="group flex min-w-[10px] flex-1 flex-col items-center justify-end">
                <div
                  className={
                    'w-full rounded-t-sm transition-all ' +
                    (d.revenue > 0
                      ? isToday
                        ? 'bg-gradient-to-t from-gold to-gold-soft'
                        : 'bg-gold/40 group-hover:bg-gold/70'
                      : 'bg-white/5')
                  }
                  style={{ height: `${Math.max(h, d.revenue > 0 ? 4 : 2)}%` }}
                  title={`Day ${d.day}: ${formatPrice(d.revenue)} · ${d.count} order(s)`}
                />
                {(d.day === 1 || d.day % 5 === 0) && (
                  <span className="mt-1 text-[9px] text-muted">{d.day}</span>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-muted">
          Hover a bar for that day's revenue and order count. Today is highlighted in gold.
        </p>
      </div>
    </div>
  );
}
