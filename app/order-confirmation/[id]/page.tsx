'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import type { Order } from '@/types';
import { backend } from '@/services';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { formatPrice, shortId } from '@/utils/format';

/** Order confirmation — reads the just-placed order and reassures the guest. */
export default function ConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    backend.getOrders().then((orders) => {
      if (!active) return;
      setOrder(orders.find((o) => o.id === id) ?? null);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-6">
      {loading ? (
        <Spinner size={40} />
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full rounded-2xl border border-hairline bg-surface p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-veg/15"
          >
            <CheckCircle2 className="text-veg" size={36} />
          </motion.div>

          <h1 className="mt-5 font-display text-2xl">Order Placed!</h1>
          <p className="mt-1 text-muted">
            {order ? (
              <>
                Your order <span className="font-mono text-gold">{shortId(order.id)}</span> is with
                the kitchen.
              </>
            ) : (
              'Your order is on its way to the kitchen.'
            )}
          </p>

          {order && (
            <div className="mt-6 space-y-2 rounded-xl border border-hairline bg-elevated p-4 text-left text-sm">
              {order.items.map((i) => (
                <div key={i.dishId} className="flex justify-between">
                  <span className="text-ink/90">
                    <span className="text-gold">{i.quantity}×</span> {i.name}
                  </span>
                  <span className="text-muted">{formatPrice(i.price * i.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-hairline pt-2 font-medium">
                <span>Total</span>
                <span className="text-gold">{formatPrice(order.total)}</span>
              </div>
              <p className="pt-1 text-xs text-muted">Table {order.customer.table}</p>
            </div>
          )}

          <p className="mt-4 text-xs text-muted">
            A team member will bring your order to table{' '}
            {order ? <span className="text-ink">{order.customer.table}</span> : 'shortly'}.
          </p>

          <div className="mt-6">
            <Link href="/menu">
              <Button fullWidth size="lg">
                Order More
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
