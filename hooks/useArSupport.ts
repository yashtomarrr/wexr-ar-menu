'use client';

import { useEffect, useState } from 'react';

/**
 * Detects whether the device can do "real" AR placement.
 * - Android: WebXR immersive-ar OR Scene Viewer (Chrome) — generally true on mobile.
 * - iOS: AR Quick Look (Safari) — supported, detected via the platform.
 * Desktop usually returns false → we still show the interactive 3D preview.
 */
export function useArSupport() {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      // iOS Quick Look support
      const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const a = document.createElement('a');
      const quickLook = a.relList && a.relList.supports && a.relList.supports('ar');

      // Android WebXR support
      let webxr = false;
      const xr = (navigator as Navigator & { xr?: { isSessionSupported?: (m: string) => Promise<boolean> } }).xr;
      if (xr?.isSessionSupported) {
        try {
          webxr = await xr.isSessionSupported('immersive-ar');
        } catch {
          webxr = false;
        }
      }

      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const result = Boolean((isIOS && quickLook) || webxr || isMobile);
      if (!cancelled) setSupported(result);
    }

    check();
    return () => {
      cancelled = true;
    };
  }, []);

  return supported;
}
