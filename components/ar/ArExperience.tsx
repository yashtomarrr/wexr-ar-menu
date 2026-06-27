'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, ScanLine, Plus, X } from 'lucide-react';
import { menu } from '@/data/menu';
import { useDishStore } from '@/store/useDishStore';
import { useHydrated } from '@/hooks/useHydrated';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { VegBadge, SpiceBadge } from '@/components/ui/Badges';
import { DishQRCode } from '@/components/qr/DishQRCode';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/utils/format';

// 3D libraries are client-only and heavy → load on demand, no SSR.
const ModelPreview = dynamic(
  () => import('./ModelPreview').then((m) => m.ModelPreview),
  { ssr: false, loading: () => <Centered><Spinner size={40} /></Centered> },
);
const ARViewer = dynamic(() => import('./ARViewer').then((m) => m.ARViewer), {
  ssr: false,
});

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="grid h-full w-full place-items-center">{children}</div>;
}

/**
 * Dish AR experience screen (the QR-code / "View in AR" destination).
 * Shows an interactive R3F 3D preview + dish details, and launches the
 * fullscreen model-viewer AR overlay to place the dish in the real room.
 */
export function ArExperience({ dishId }: { dishId: string }) {
  const hydrated = useHydrated();
  const fromStore = useDishStore((s) => s.dishes.find((d) => d.id === dishId));
  // Prefer the (possibly admin-edited) store dish once hydrated; SSR-safe fallback to static menu.
  const dish = (hydrated && fromStore) || menu.find((d) => d.id === dishId);

  const add = useCartStore((s) => s.add);
  const openCart = useCartStore((s) => s.open);
  const [arOpen, setArOpen] = useState(false);

  if (!dish) {
    return (
      <div className="grid min-h-dvh place-items-center px-6 text-center">
        <div>
          <p className="font-display text-2xl">Dish not found</p>
          <Link href="/menu" className="mt-3 inline-block text-gold hover:underline">
            ← Back to menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-dvh">
      {/* top bar */}
      <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between p-4">
        <Link
          href="/menu"
          className="grid h-11 w-11 place-items-center rounded-full border border-hairline bg-black/50 text-ink backdrop-blur hover:border-gold/40"
          aria-label="Back to menu"
        >
          <ArrowLeft size={20} />
        </Link>
        <span className="rounded-full border border-hairline bg-black/40 px-3 py-1.5 text-xs tracking-wide text-muted backdrop-blur">
          Augmented Reality
        </span>
      </div>

      {/* 3D preview */}
      <div className="h-[58vh] w-full bg-[radial-gradient(ellipse_60%_60%_at_50%_35%,rgba(212,175,55,0.08),transparent_70%)]">
        <ModelPreview url={dish.model} rotationY={dish.rotation} />
      </div>

      {/* info sheet */}
      <div className="relative z-10 -mt-8 rounded-t-xl2 border-t border-hairline bg-surface px-5 pb-10 pt-6">
        <div className="mx-auto max-w-xl">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <VegBadge veg={dish.veg} />
              <h1 className="font-display text-2xl">{dish.name}</h1>
            </div>
            <span className="font-display text-2xl text-gold">{formatPrice(dish.price)}</span>
          </div>

          <div className="mt-1 flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-widest text-gold-soft">{dish.category}</span>
            <SpiceBadge level={dish.spice} />
          </div>

          <p className="mt-3 text-sm leading-relaxed text-muted">{dish.description}</p>

          {dish.sizeLabel && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-hairline bg-elevated px-3 py-2 text-sm">
              <ScanLine size={15} className="text-gold" />
              Actual serving size · <span className="text-ink">{dish.sizeLabel}</span>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="flex-1" onClick={() => setArOpen(true)}>
              <ScanLine size={18} /> View in Your Room
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="flex-1"
              onClick={() => {
                add(dish, 1);
                openCart();
              }}
            >
              <Plus size={18} /> Add to Order
            </Button>
          </div>

          {/* QR for this dish */}
          <div className="mt-8 flex items-center gap-4 rounded-2xl border border-hairline bg-elevated p-4">
            <DishQRCode dishId={dish.id} size={96} />
            <div>
              <p className="font-medium">Scan to open on your phone</p>
              <p className="mt-1 text-xs text-muted">
                Print this code beside the dish on your physical menu — guests scan it to jump
                straight into AR.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen AR overlay */}
      {arOpen && (
        <div className="fixed inset-0 z-50">
          <ARViewer dish={dish} />
          <button
            onClick={() => setArOpen(false)}
            className="absolute right-4 top-4 z-[60] grid h-11 w-11 place-items-center rounded-full border border-hairline bg-black/50 text-ink backdrop-blur hover:border-gold/40"
            aria-label="Close AR"
          >
            <X size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
