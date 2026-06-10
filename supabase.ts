import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xhmwvlwjjlpzndlhknrz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhobXd2bHdqamxwem5kbGhrbnJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMDQ4MjQsImV4cCI6MjA5NjU4MDgyNH0.R32TFOLFK7CVFmUBVV8nahLkVmwjLtUbp-vEq5_WZn8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fallback: ensure any direct `fetch` calls to the Supabase REST/storage endpoints
// include the anon key and Authorization header. This helps when some code
// issues direct fetch requests (or a build strips headers) and receives 401.
if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
  try {
    const originalFetch = window.fetch.bind(window) as typeof fetch;
    (window as any).fetch = (input: RequestInfo, init?: RequestInit) => {
      try {
        const url = typeof input === 'string' ? input : (input as Request).url;
        if (typeof url === 'string' && url.includes(new URL(SUPABASE_URL).hostname)) {
          init = init || {};
          init.headers = init.headers || {};
          const headers = new Headers(init.headers as HeadersInit);
          if (!headers.get('apikey')) headers.set('apikey', SUPABASE_ANON_KEY);
          if (!headers.get('Authorization')) headers.set('Authorization', `Bearer ${SUPABASE_ANON_KEY}`);
          init.headers = headers;
        }
      } catch (e) {
        // ignore and continue with original fetch
      }
      return originalFetch(input, init);
    };
  } catch (e) {
    // non-fatal
  }
}

export const BUCKET_LOGOS = 'logos';
export const BUCKET_OFFERS = 'offers';
export const BUCKET_SPECIAL_OFFERS = 'special-offers';

export async function uploadImage(
  bucket: string,
  file: File,
  path?: string
): Promise<string> {
  const filePath = path ?? `${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from(bucket).upload(filePath, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}

export async function deleteImage(bucket: string, url: string): Promise<void> {
  const base = supabase.storage.from(bucket).getPublicUrl('').data.publicUrl;
  const path = url.replace(base, '');
  if (!path) return;
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) console.warn('[deleteImage]', error.message);
}
