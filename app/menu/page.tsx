import { MenuGrid } from '@/components/menu/MenuGrid';
import { restaurantConfig } from '@/data/restaurant.config';

/** Menu page — header + filterable card grid (client-interactive grid inside). */
export default function MenuPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-6">
      <header className="mb-2 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold-soft">{restaurantConfig.tagline}</p>
        <h1 className="mt-2 font-display text-4xl">Our Menu</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          Tap “View in AR” on any dish to preview it life-size before you order.
        </p>
      </header>

      <MenuGrid />
    </div>
  );
}
