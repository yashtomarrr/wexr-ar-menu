import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Single shared Supabase client, created only when env vars are present.
 * Returns null otherwise so the app safely falls back to the local backend.
 */
let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  client = createClient(url, key, {
    realtime: { params: { eventsPerSecond: 5 } },
  });
  return client;
}
