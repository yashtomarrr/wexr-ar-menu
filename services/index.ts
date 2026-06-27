import type { BackendService } from '@/types';
import { localBackend } from './localBackend';
import { supabaseBackend } from './supabaseBackend';

/**
 * Backend selector — the rest of the app imports `backend` and never cares
 * which driver is active. Switch drivers with NEXT_PUBLIC_BACKEND.
 *
 *   local    -> localStorage + cross-tab live sync (default, zero-config)
 *   supabase -> real-time, cross-device (needs env keys + an orders table)
 */
const driver = process.env.NEXT_PUBLIC_BACKEND ?? 'local';

export const backend: BackendService =
  driver === 'supabase' ? supabaseBackend : localBackend;
