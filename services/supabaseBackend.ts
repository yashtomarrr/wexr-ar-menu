import type { BackendService, Order, OrderStatus } from '@/types';
import { getSupabase } from '@/lib/supabaseClient';

/**
 * SUPABASE backend (production, real-time, cross-device).
 * Enable by setting NEXT_PUBLIC_BACKEND=supabase plus the URL/anon key.
 * Requires an `orders` table (SQL is in DEPLOYMENT.md).
 *
 * Table columns: id (text pk), created_at (int8), status (text),
 *                items (jsonb), customer (jsonb), total (numeric)
 */
const TABLE = 'orders';

// DB row <-> domain Order mappers (snake_case <-> camelCase)
type Row = {
  id: string;
  created_at: number;
  status: OrderStatus;
  items: Order['items'];
  customer: Order['customer'];
  total: number;
};

const toRow = (o: Order): Row => ({
  id: o.id,
  created_at: o.createdAt,
  status: o.status,
  items: o.items,
  customer: o.customer,
  total: o.total,
});

const toOrder = (r: Row): Order => ({
  id: r.id,
  createdAt: r.created_at,
  status: r.status,
  items: r.items,
  customer: r.customer,
  total: r.total,
});

export const supabaseBackend: BackendService = {
  async createOrder(order: Order) {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase not configured');
    const { error } = await sb.from(TABLE).insert(toRow(order));
    if (error) throw error;
    return order;
  },

  async getOrders() {
    const sb = getSupabase();
    if (!sb) return [];
    const { data, error } = await sb
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data as Row[]).map(toOrder);
  },

  async updateOrderStatus(id: string, status: OrderStatus) {
    const sb = getSupabase();
    if (!sb) return;
    const { error } = await sb.from(TABLE).update({ status }).eq('id', id);
    if (error) throw error;
  },

  subscribe(onChange) {
    const sb = getSupabase();
    if (!sb) return () => {};

    const refetch = async () => {
      const { data } = await sb
        .from(TABLE)
        .select('*')
        .order('created_at', { ascending: false });
      if (data) onChange((data as Row[]).map(toOrder));
    };

    const sub = sb
      .channel('orders-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLE },
        refetch,
      )
      .subscribe();

    return () => {
      sb.removeChannel(sub);
    };
  },
};
