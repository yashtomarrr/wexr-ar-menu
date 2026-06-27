import { restaurantConfig } from '@/data/restaurant.config';

/** Format a number as the restaurant's currency, e.g. 349 -> "₹349". */
export function formatPrice(amount: number): string {
  return `${restaurantConfig.currencySymbol}${amount.toLocaleString('en-IN')}`;
}

/** Short, human time like "2:45 PM". */
export function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** "5m ago" style relative time for the orders dashboard. */
export function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/** Build a short, readable order id like "WX-8F3K". */
export function shortId(id: string): string {
  return `WX-${id.slice(0, 4).toUpperCase()}`;
}
