'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Box, Plus } from 'lucide-react';
import type { Dish } from '@/types';
import { VegBadge, BestSellerBadge, SpiceBadge } from '@/components/ui/Badges';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/utils/format';

const FALLBACK_IMG = '/dishes/_fallback.svg';

/**
 * Premium dish card matching the luxury reference: rounded image, gold accents,
 * veg/spice/best-seller badges, an "View in AR" action and an add-to-cart
 * control with a quantity stepper. Lifts on hover (Framer Motion).
 */
export function DishCard({ dish, index = 0 }: { dish: Dish; index?: number }) {
  const add = useCartStore((s) => s.add);
  const openCart = useCartStore((s) => s.open);
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(dish.image);
  const soldOut = dish.available === false;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.4) }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col overflow-hidden rounded-xl2 border border-hairline bg-surface shadow-card"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={img}
          alt={dish.name}
          fill
          sizes="(max-width:768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImg(FALLBACK_IMG)}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* top-left badges */}
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="grid place-items-center rounded-md bg-black/55 p-1 backdrop-blur">
            <VegBadge veg={dish.veg} />
          </span>
          {dish.bestSeller && <BestSellerBadge />}
        </div>

        {/* AR quick action */}
        <Link
          href={`/ar/${dish.id}`}
          className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-gold/95 px-3 py-1.5 text-xs font-semibold text-black shadow-gold-glow transition-transform hover:scale-105"
        >
          <Box size={14} /> View in AR
        </Link>

        {soldOut && (
          <div className="absolute inset-0 grid place-items-center bg-black/65">
            <span className="rounded-full border border-hairline px-4 py-1 text-sm tracking-wide text-muted">
              Sold out
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg leading-tight">{dish.name}</h3>
          <span className="shrink-0 font-display text-lg text-gold">{formatPrice(dish.price)}</span>
        </div>

        <div className="mt-1 flex items-center gap-3">
          <span className="text-[11px] uppercase tracking-widest text-gold-soft">{dish.category}</span>
          <SpiceBadge level={dish.spice} />
        </div>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{dish.description}</p>

        {dish.sizeLabel && (
          <p className="mt-2 text-[11px] text-muted/80">Serving · {dish.sizeLabel}</p>
        )}

        {/* Actions */}
        <div className="mt-4 flex items-center gap-2">
          <QuantitySelector size="sm" value={qty} onChange={setQty} />
          <Button
            size="sm"
            className="flex-1"
            disabled={soldOut}
            onClick={() => {
              add(dish, qty);
              setQty(1);
              openCart();
            }}
          >
            <Plus size={16} /> Add to Order
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
