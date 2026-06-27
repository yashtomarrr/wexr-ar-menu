import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * `cn` merges conditional class names and resolves Tailwind conflicts
 * (e.g. cn('p-2', cond && 'p-4') -> 'p-4'). Used across all components.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
