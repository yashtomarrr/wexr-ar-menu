import type { BackendService, Order, OrderStatus } from '@/types';

/**
 * LOCAL backend (default, zero-config).
 * Persists orders to localStorage and broadcasts changes across tabs via
 * BroadcastChannel (+ storage events as a fallback). This makes the
 * restaurant dashboard update LIVE when a customer places an order in
 * another tab/device-on-same-browser — perfect for demos with no setup.
 *
 * Swap to Supabase (see supabaseBackend.ts) for real cross-device orders.
 */
const KEY = 'wexr_orders_v1';
const CHANNEL = 'wexr_orders';

function read(): Order[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]') as Order[];
  } catch {
    return [];
  }
}

function write(orders: Order[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(orders));
}

// Lazily-created broadcast channel (guarded for SSR / older browsers).
let channel: BroadcastChannel | null = null;
function getChannel(): BroadcastChannel | null {
  if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined')
    return null;
  if (!channel) channel = new BroadcastChannel(CHANNEL);
  return channel;
}

function notify() {
  getChannel()?.postMessage('changed');
}

export const localBackend: BackendService = {
  async createOrder(order: Order) {
    const orders = read();
    orders.unshift(order);
    write(orders);
    notify();
    return order;
  },

  async getOrders() {
    return read().sort((a, b) => b.createdAt - a.createdAt);
  },

  async updateOrderStatus(id: string, status: OrderStatus) {
    const orders = read().map((o) => (o.id === id ? { ...o, status } : o));
    write(orders);
    notify();
  },

  subscribe(onChange) {
    const handler = () => onChange(read().sort((a, b) => b.createdAt - a.createdAt));

    const ch = getChannel();
    ch?.addEventListener('message', handler);

    // storage event fires in OTHER tabs when localStorage changes
    const storageHandler = (e: StorageEvent) => {
      if (e.key === KEY) handler();
    };
    if (typeof window !== 'undefined')
      window.addEventListener('storage', storageHandler);

    return () => {
      ch?.removeEventListener('message', handler);
      if (typeof window !== 'undefined')
        window.removeEventListener('storage', storageHandler);
    };
  },
};
