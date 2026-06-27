import { cn } from '@/utils/cn';

/** Gold ring loading spinner. */
export function Spinner({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn('inline-block animate-spin rounded-full border-2 border-gold/25 border-t-gold', className)}
      style={{ width: size, height: size }}
    />
  );
}

/** Full-screen loading overlay used while AR models stream in. */
export function LoadingOverlay({ label = 'Loading 3D model…' }: { label?: string }) {
  return (
    <div className="absolute inset-0 z-20 grid place-items-center bg-bg/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Spinner size={40} />
        <p className="text-sm tracking-wide text-muted">{label}</p>
      </div>
    </div>
  );
}
