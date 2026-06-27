import Link from 'next/link';
import { ScanLine, Sparkles, UtensilsCrossed } from 'lucide-react';
import { Hero } from '@/components/branding/Hero';
import { DishCard } from '@/components/menu/DishCard';
import { menu } from '@/data/menu';

/**
 * Homepage = luxury hero + a "how it works" strip + a few best-sellers.
 * Server component (static) for fast first paint; cards hydrate on the client.
 */
const STEPS = [
  { icon: UtensilsCrossed, title: 'Browse the menu', body: 'Explore every dish with rich photography and details.' },
  { icon: ScanLine, title: 'View in AR', body: 'Tap a dish to place a life-size 3D model on your table.' },
  { icon: Sparkles, title: 'Order with confidence', body: 'See exactly what arrives, then order in a tap.' },
];

export default function HomePage() {
  const featured = menu.filter((d) => d.bestSeller).slice(0, 3);

  return (
    <>
      <Hero />

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.title} className="rounded-2xl border border-hairline bg-surface p-6">
              <s.icon className="text-gold" size={26} />
              <h3 className="mt-4 font-display text-lg">{s.title}</h3>
              <p className="mt-1 text-sm text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured dishes */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-3xl">Signature Dishes</h2>
          <Link href="/menu" className="text-sm text-gold hover:underline">
            View full menu →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((dish, i) => (
            <DishCard key={dish.id} dish={dish} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
