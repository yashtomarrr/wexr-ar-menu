'use client';

import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import type { Category, Dish, SpiceLevel } from '@/types';
import { Button } from '@/components/ui/Button';

/**
 * Add/Edit dish form used by the Admin panel.
 * Supports a URL or a local file (creates an in-session object URL) for both
 * the image and the GLB model — so an owner can manage the menu with no code.
 * For production, wire `onUpload*` to your storage (Supabase Storage / S3).
 */
const CATEGORIES: Category[] = ['Starter', 'Main Course', 'Bread & Rice', 'Dessert', 'Beverage'];
const SPICES: SpiceLevel[] = ['None', 'Mild', 'Medium', 'Hot'];

const slug = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const blank: Dish = {
  id: '',
  name: '',
  description: '',
  price: 0,
  category: 'Starter',
  image: '/dishes/_fallback.svg',
  model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
  modelIos: 'https://modelviewer.dev/shared-assets/models/Astronaut.usdz',
  realScale: { x: 0.2, y: 0.06, z: 0.2 },
  rotation: 0,
  veg: true,
  spice: 'None',
  bestSeller: false,
  available: true,
  sizeLabel: '',
};

export function DishForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Dish;
  onSave: (dish: Dish) => void;
  onCancel: () => void;
}) {
  const [d, setD] = useState<Dish>(initial ?? blank);
  const imgInput = useRef<HTMLInputElement>(null);
  const glbInput = useRef<HTMLInputElement>(null);

  const set = <K extends keyof Dish>(k: K, v: Dish[K]) => setD((p) => ({ ...p, [k]: v }));

  function pickFile(ref: React.RefObject<HTMLInputElement>, key: 'image' | 'model') {
    const file = ref.current?.files?.[0];
    if (file) set(key, URL.createObjectURL(file));
  }

  function save() {
    const id = d.id || slug(d.name);
    if (!id || !d.name) return;
    onSave({ ...d, id });
  }

  const field =
    'w-full rounded-lg border border-hairline bg-elevated px-3 py-2 text-sm text-ink outline-none focus:border-gold/50';
  const lbl = 'mb-1 block text-xs text-muted';

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={lbl}>Dish name *</label>
          <input className={field} value={d.name} onChange={(e) => set('name', e.target.value)} />
        </div>
        <div>
          <label className={lbl}>Price (₹) *</label>
          <input
            type="number"
            className={field}
            value={d.price}
            onChange={(e) => set('price', Number(e.target.value))}
          />
        </div>
      </div>

      <div>
        <label className={lbl}>Description</label>
        <textarea
          className={`${field} min-h-20 resize-none`}
          value={d.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={lbl}>Category</label>
          <select className={field} value={d.category} onChange={(e) => set('category', e.target.value as Category)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={lbl}>Spice</label>
          <select className={field} value={d.spice} onChange={(e) => set('spice', e.target.value as SpiceLevel)}>
            {SPICES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={lbl}>Serving size label</label>
          <input className={field} value={d.sizeLabel ?? ''} onChange={(e) => set('sizeLabel', e.target.value)} placeholder='12" diameter' />
        </div>
      </div>

      {/* Image */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={lbl}>Image URL</label>
          <div className="flex gap-2">
            <input className={field} value={d.image} onChange={(e) => set('image', e.target.value)} />
            <Button type="button" variant="secondary" size="sm" onClick={() => imgInput.current?.click()}>
              <Upload size={14} />
            </Button>
            <input ref={imgInput} type="file" accept="image/*" hidden onChange={() => pickFile(imgInput, 'image')} />
          </div>
        </div>
        <div>
          <label className={lbl}>GLB model URL</label>
          <div className="flex gap-2">
            <input className={field} value={d.model} onChange={(e) => set('model', e.target.value)} />
            <Button type="button" variant="secondary" size="sm" onClick={() => glbInput.current?.click()}>
              <Upload size={14} />
            </Button>
            <input ref={glbInput} type="file" accept=".glb,.gltf" hidden onChange={() => pickFile(glbInput, 'model')} />
          </div>
        </div>
      </div>

      <div>
        <label className={lbl}>iOS model URL (.usdz)</label>
        <input className={field} value={d.modelIos ?? ''} onChange={(e) => set('modelIos', e.target.value)} />
      </div>

      {/* Real size */}
      <div>
        <label className={lbl}>Real size in metres (x / y / z)</label>
        <div className="grid grid-cols-3 gap-2">
          {(['x', 'y', 'z'] as const).map((axis) => (
            <input
              key={axis}
              type="number"
              step="0.01"
              className={field}
              value={d.realScale[axis]}
              onChange={(e) => set('realScale', { ...d.realScale, [axis]: Number(e.target.value) })}
            />
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-5">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={d.veg} onChange={(e) => set('veg', e.target.checked)} /> Vegetarian
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!d.bestSeller} onChange={(e) => set('bestSeller', e.target.checked)} /> Best seller
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={d.available ?? true} onChange={(e) => set('available', e.target.checked)} /> Available
        </label>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button onClick={save} disabled={!d.name}>Save Dish</Button>
      </div>
    </div>
  );
}
