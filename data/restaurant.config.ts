import type { RestaurantConfig } from '@/types';

/**
 * ════════════════════════════════════════════════════════════════
 *  RESTAURANT CONFIG  —  edit THIS file to re-brand for a new client.
 *  Name, logo, hero copy, currency and the whole colour theme live here.
 *  Nothing else in the codebase needs to change to launch a new restaurant.
 * ════════════════════════════════════════════════════════════════
 */
export const restaurantConfig: RestaurantConfig = {
  name: 'Maison Doré',
  tagline: 'Modern Fine Dining',
  // Put a logo at /public/logo.svg (or any URL). A tasteful SVG ships by default.
  logo: '/logo.svg',
  heroHeadline: 'Experience Your Food Before You Order',
  heroSub: 'Preview every dish in stunning, life-size Augmented Reality.',
  currency: 'INR',
  currencySymbol: '₹',

  // Theme = RGB channels ("R G B"). These flow into CSS variables in layout.tsx.
  theme: {
    bg: '10 10 10',
    surface: '20 18 16',
    elevated: '28 25 21',
    gold: '212 175 55',
    goldSoft: '191 161 74',
    ink: '245 240 232',
    muted: '168 160 148',
    veg: '34 197 94',
    nonveg: '239 68 68',
  },

  poweredBy: 'WeXR Immersive Pvt. Ltd.',
};
