'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Pencil, Trash2, RotateCcw, Eye, EyeOff } from 'lucide-react';
import type { Dish } from '@/types';
import { useDishStore } from '@/store/useDishStore';
import { useHydrated } from '@/hooks/useHydrated';
import { Button } from '@/components/ui/Button';
import { DishForm } from '@/components/admin/DishForm';
import { DishQRCode } from '@/components/qr/DishQRCode';
import { formatPrice } from '@/utils/format';

/**
 * Admin panel — manage the menu with zero code: add, edit, delete, toggle
 * availability, and print a per-dish QR. Backed by the persisted dish store,
 * so changes appear instantly across the customer menu.
 */
export default function AdminPage() {
  const hydrated = useHydrated();
  const { dishes, upsert, remove, toggleAvailable, resetToDefault } = useDishStore();
  const [editing, setEditing] = useState<Dish | null>(null);
  const [adding, setAdding] = useState(false);

  const showForm = adding || editing;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/dashboard" className="text-xs text-gold hover:underline">← Order Panel</Link>
          <h1 className="mt-1 font-display text-3xl">Menu Manager</h1>
          <p className="mt-1 text-sm text-muted">Add, edit or remove dishes — no coding required.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={resetToDefault} title="Restore sample menu">
            <RotateCcw size={16} /> Reset
          </Button>
          <Button onClick={() => { setAdding(true); setEditing(null); }}>
            <Plus size={18} /> Add Dish
          </Button>
        </div>
      </div>

      {/* Form modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setAdding(false); setEditing(null); }}
            />
            <motion.div
              className="fixed inset-x-4 top-[6vh] z-50 mx-auto max-w-2xl rounded-2xl border border-hairline bg-surface p-6 shadow-card"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
            >
              <h2 className="mb-4 font-display text-2xl">{editing ? 'Edit Dish' : 'Add Dish'}</h2>
              <div className="max-h-[78vh] overflow-y-auto pr-1">
                <DishForm
                  initial={editing ?? undefined}
                  onSave={(dish) => {
                    upsert(dish);
                    setAdding(false);
                    setEditing(null);
                  }}
                  onCancel={() => { setAdding(false); setEditing(null); }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Dish list */}
      <div className="mt-8 space-y-3">
        {(hydrated ? dishes : []).map((d) => (
          <div
            key={d.id}
            className="flex flex-wrap items-center gap-4 rounded-2xl border border-hairline bg-surface p-3"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-elevated">
              <Image src={d.image} alt={d.name} fill sizes="64px" className="object-cover" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-medium">{d.name}</p>
                {d.available === false && (
                  <span className="rounded-full bg-nonveg/15 px-2 py-0.5 text-[10px] text-nonveg">Sold out</span>
                )}
              </div>
              <p className="text-xs text-muted">{d.category} · {formatPrice(d.price)}</p>
            </div>

            <div className="hidden sm:block">
              <DishQRCode dishId={d.id} size={56} />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleAvailable(d.id)}
                className="grid h-9 w-9 place-items-center rounded-lg border border-hairline text-muted hover:text-gold"
                title={d.available === false ? 'Mark available' : 'Mark sold out'}
              >
                {d.available === false ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button
                onClick={() => { setEditing(d); setAdding(false); }}
                className="grid h-9 w-9 place-items-center rounded-lg border border-hairline text-muted hover:text-gold"
                title="Edit"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => remove(d.id)}
                className="grid h-9 w-9 place-items-center rounded-lg border border-nonveg/40 text-nonveg hover:bg-nonveg/10"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
