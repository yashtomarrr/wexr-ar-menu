import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { restaurantConfig } from '@/data/restaurant.config';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';

/** Display serif (luxury headings) + clean sans (body). Exposed as CSS vars. */
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${restaurantConfig.name} — AR Menu`,
  description: restaurantConfig.heroSub,
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

/**
 * Root layout. Injects the restaurant theme (from config) as CSS variables on
 * <html>, so re-skinning a client is purely a data change. Mounts the global
 * navbar, slide-in cart and footer once for the whole app.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const t = restaurantConfig.theme;
  const themeVars = {
    '--bg': t.bg,
    '--surface': t.surface,
    '--elevated': t.elevated,
    '--gold': t.gold,
    '--gold-soft': t.goldSoft,
    '--ink': t.ink,
    '--muted': t.muted,
    '--veg': t.veg,
    '--nonveg': t.nonveg,
  } as React.CSSProperties;

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`} style={themeVars}>
      <body className="min-h-dvh antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
