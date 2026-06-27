'use client';

import { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { arUrl } from '@/utils/url';

/**
 * Generates a scannable QR code that opens the AR experience for a specific
 * dish (/ar/<id>). Used on the menu, the AR page and the Admin panel so a
 * restaurant can print a code next to each dish.
 */
export function DishQRCode({
  dishId,
  size = 132,
  showUrl = false,
}: {
  dishId: string;
  size?: number;
  showUrl?: boolean;
}) {
  // Build the absolute URL on the client so it picks up the real origin.
  const [url, setUrl] = useState('');
  useEffect(() => setUrl(arUrl(dishId)), [dishId]);

  if (!url) {
    return (
      <div
        className="skeleton animate-shimmer rounded-xl"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="rounded-xl bg-white p-2.5">
        <QRCodeCanvas
          value={url}
          size={size}
          level="M"
          fgColor="#0a0a0a"
          bgColor="#ffffff"
          includeMargin={false}
        />
      </div>
      {showUrl && <span className="max-w-[180px] truncate text-[10px] text-muted">{url}</span>}
    </div>
  );
}
