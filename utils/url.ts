/**
 * Resolve the public site origin used to build absolute QR links.
 * Order of preference: explicit env var -> current browser origin -> ''.
 */
export function siteOrigin(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/$/, '');
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

/** Absolute URL that opens the AR experience for a specific dish. */
export function arUrl(dishId: string): string {
  return `${siteOrigin()}/ar/${dishId}`;
}
