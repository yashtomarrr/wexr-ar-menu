'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { restaurantConfig } from '@/data/restaurant.config';
import { useCartStore } from '@/store/useCartStore';
import { useHydrated } from '@/hooks/useHydrated';
import { cn } from '@/utils/cn';

/** Sticky top navigation with brand mark and a live cart button. */
export function Navbar() {
  const pathname = usePathname();
  const openCart = useCartStore((s) => s.open);
  const count = useCartStore((s) => s.lines.reduce((n, l) => n + l.quantity, 0));
  const hydrated = useHydrated();

  // AR fullscreen route hides the chrome for an immersive feel
  if (pathname?.startsWith('/ar/')) return null;

  // Customer-facing nav only. Staff reach the panel via /login (middleware-guarded).
  const links = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/login', label: 'Staff' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-bg/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image src={restaurantConfig.logo} alt={restaurantConfig.name} width={36} height={36} priority />
          <span className="font-display text-lg tracking-wide text-ink">
            {restaurantConfig.name}
          </span>
        </Link>

        <div className="ml-auto hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'rounded-lg px-3 py-2 text-sm transition-colors',
                pathname === l.href ? 'text-gold' : 'text-muted hover:text-ink',
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <button
          onClick={openCart}
          aria-label="Open cart"
          className="relative ml-auto grid h-11 w-11 place-items-center rounded-xl border border-hairline bg-elevated text-ink hover:border-gold/40 md:ml-2"
        >
          <ShoppingBag size={19} />
          {hydrated && count > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] font-bold text-black"
            >
              {count}
            </motion.span>
          )}
        </button>
      </nav>
    </header>
  );
}
