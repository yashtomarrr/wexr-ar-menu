import { restaurantConfig } from '@/data/restaurant.config';

/** Slim footer carrying the WeXR branding (kept on every non-AR page). */
export function Footer() {
  return (
    <footer className="mt-20 border-t border-hairline">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 py-10 text-center">
        <p className="font-display text-lg text-ink">{restaurantConfig.name}</p>
        <p className="text-xs tracking-wide text-muted">{restaurantConfig.tagline}</p>
        <p className="mt-3 text-xs text-muted">
          Powered by{' '}
          <span className="font-medium text-gold">{restaurantConfig.poweredBy}</span>
        </p>
      </div>
    </footer>
  );
}
