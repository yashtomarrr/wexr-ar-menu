'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Box, RotateCcw, ScanLine } from 'lucide-react';
import type { Dish } from '@/types';
import { LoadingOverlay } from '@/components/ui/Spinner';
import { useArSupport } from '@/hooks/useArSupport';

/**
 * Fullscreen AR viewer built on Google <model-viewer>, which gives us — for
 * free and cross-platform — plane detection, lighting estimation, shadow
 * receiver, auto scaling, occlusion-ready rendering and touch gestures
 * (pinch-zoom / rotate / move). On iOS it routes to AR Quick Look, on Android
 * to Scene Viewer / WebXR.
 *
 * `ar-scale="fixed"` keeps the model at its real authored size, so a GLB
 * modelled in metres appears life-size. Replace the demo model with the
 * dish's real scan to get true serving size.
 */
export function ARViewer({ dish }: { dish: Dish }) {
  const ref = useRef<HTMLElement & { resetTurntableRotation?: () => void; activateAR?: () => void }>(null);
  const [ready, setReady] = useState(false);
  const [loadedModel, setLoadedModel] = useState(false);
  const arSupported = useArSupport();

  // Register the <model-viewer> custom element on the client only.
  useEffect(() => {
    let mounted = true;
    import('@google/model-viewer').then(() => mounted && setReady(true));
    return () => {
      mounted = false;
    };
  }, []);

  // Wire the model 'load' event once the element exists.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onLoad = () => setLoadedModel(true);
    el.addEventListener('load', onLoad);
    return () => el.removeEventListener('load', onLoad);
  }, [ready]);

  return (
    <div className="fixed inset-0 bg-bg">
      {!ready && <LoadingOverlay label="Preparing AR…" />}

      {ready && (
        <model-viewer
          ref={ref as never}
          src={dish.model}
          ios-src={dish.modelIos}
          alt={dish.name}
          poster={dish.image}
          camera-controls
          auto-rotate
          auto-rotate-delay={600}
          rotation-per-second="18deg"
          shadow-intensity="1.2"
          shadow-softness="1"
          exposure="1.05"
          environment-image="neutral"
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-scale="fixed"
          ar-placement="floor"
          touch-action="pan-y"
          interaction-prompt="auto"
          style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
        >
          {/* Loading overlay while the model streams */}
          {!loadedModel && <LoadingOverlay label={`Loading ${dish.name}…`} />}

          {/* Custom AR launch button (slotted into model-viewer) */}
          <button
            slot="ar-button"
            className="absolute bottom-6 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-gradient-to-b from-gold to-gold-soft px-6 py-3.5 text-sm font-semibold text-black shadow-gold-glow"
          >
            <ScanLine size={18} /> Place on your table
          </button>
        </model-viewer>
      )}

      {/* Size / serving info */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="pointer-events-none absolute left-4 top-20 rounded-2xl border border-hairline bg-black/45 px-4 py-3 backdrop-blur"
      >
        <p className="font-display text-lg">{dish.name}</p>
        {dish.sizeLabel && (
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gold">
            <Box size={13} /> Actual size · {dish.sizeLabel}
          </p>
        )}
      </motion.div>

      {/* Reset camera */}
      <button
        onClick={() => ref.current?.resetTurntableRotation?.()}
        className="absolute bottom-6 right-4 z-10 grid h-12 w-12 place-items-center rounded-full border border-hairline bg-black/50 text-ink backdrop-blur hover:border-gold/40"
        aria-label="Reset position"
      >
        <RotateCcw size={20} />
      </button>

      {/* Fallback hint when device can't do real AR */}
      {arSupported === false && (
        <div className="pointer-events-none absolute bottom-24 left-1/2 max-w-xs -translate-x-1/2 rounded-xl border border-hairline bg-black/60 px-4 py-2 text-center text-xs text-muted backdrop-blur">
          Your device can’t place objects in the room — but you can still rotate
          and zoom the dish here. Open on a phone for full AR.
        </div>
      )}
    </div>
  );
}
