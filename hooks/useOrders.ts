'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Order, OrderStatus } from '@/types';
import { backend } from '@/services';

/**
 * React hook around the backend service. Loads orders, subscribes to live
 * changes (cross-tab locally, or realtime via Supabase) and exposes a
 * status updater. Powers the restaurant dashboard.
 */
export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    backend.getOrders().then((o) => {
      if (active) {
        setOrders(o);
        setLoading(false);
      }
    });

    const unsub = backend.subscribe((o) => {
      if (active) setOrders(o);
    });

    return () => {
      active = false;
      unsub();
    };
  }, []);

  const updateStatus = useCallback(
    async (id: string, status: OrderStatus) => {
      // optimistic update for snappy UI
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o)),
      );
      await backend.updateOrderStatus(id, status);
    },
    [],
  );

  return { orders, loading, updateStatus };
}
