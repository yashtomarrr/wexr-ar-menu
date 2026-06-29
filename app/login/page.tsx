'use client';

import { Suspense, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, User } from 'lucide-react';
import { restaurantConfig } from '@/data/restaurant.config';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

/**
 * Restaurant login. Posts to /api/login; on success the server sets the
 * session cookie and we redirect to the originally requested page (?from)
 * or the order panel.
 */
function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get('from') || '/dashboard';

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
      });
      if (!res.ok) {
        setError('Invalid ID or password. Please try again.');
        setLoading(false);
        return;
      }
      router.replace(from);
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  const field =
    'w-full rounded-xl border border-hairline bg-elevated pl-11 pr-4 py-3 text-ink placeholder:text-muted/60 outline-none focus:border-gold/50';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm rounded-2xl border border-hairline bg-surface p-8 shadow-card"
    >
      <div className="flex flex-col items-center text-center">
        <Image src={restaurantConfig.logo} alt={restaurantConfig.name} width={56} height={56} />
        <h1 className="mt-4 font-display text-2xl">{restaurantConfig.name}</h1>
        <p className="mt-1 text-xs uppercase tracking-[0.25em] text-gold-soft">Restaurant Panel</p>
      </div>

      <form onSubmit={submit} className="mt-7 space-y-3">
        <div className="relative">
          <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            className={field}
            placeholder="Restaurant ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            autoCapitalize="none"
            autoComplete="username"
            required
          />
        </div>
        <div className="relative">
          <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="password"
            className={field}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {error && <p className="text-sm text-nonveg">{error}</p>}

        <Button type="submit" size="lg" fullWidth disabled={loading}>
          {loading ? <Spinner size={20} /> : 'Sign In'}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-muted">
        Access provided by {restaurantConfig.poweredBy}
      </p>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="grid min-h-[80vh] place-items-center px-4">
      <Suspense fallback={<Spinner size={36} />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
