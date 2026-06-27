'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Box, UtensilsCrossed } from 'lucide-react';
import { restaurantConfig } from '@/data/restaurant.config';
import { Button } from '@/components/ui/Button';

/** Luxury hero: brand mark, restaurant name, headline and the two CTAs. */
export function Hero() {
  const { name, tagline, logo, heroHeadline, heroSub } = restaurantConfig;

  return (
    <section className="relative overflow-hidden">
      {/* ambient gold glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-40 h-96 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(212,175,55,0.16),transparent_70%)]" />

      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 pb-16 pt-20 text-center sm:pt-28">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="animate-float"
        >
          <Image src={logo} alt={name} width={84} height={84} priority />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-6 text-xs uppercase tracking-[0.35em] text-gold-soft"
        >
          {tagline}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-3 font-display text-4xl leading-tight sm:text-6xl"
        >
          {name}
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-6 max-w-2xl font-display text-2xl text-gold-gradient sm:text-3xl"
        >
          {heroHeadline}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-4 max-w-xl text-muted"
        >
          {heroSub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-9 flex flex-col gap-3 sm:flex-row"
        >
          <Link href="/menu">
            <Button size="lg">
              <UtensilsCrossed size={18} /> Browse Menu
            </Button>
          </Link>
          <Link href="/menu">
            <Button size="lg" variant="ghost">
              <Box size={18} /> View in AR
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
