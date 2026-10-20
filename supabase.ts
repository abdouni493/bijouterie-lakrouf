import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ttqdallrdkqnuyduodrf.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0cWRhbGxyZGtxbnV5ZHVvZHJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1MTYwMDcsImV4cCI6MjEwODA5MjAwN30.0VvJLrugNYFjyXWFx67_QZsbu7Rrut49_uDcKO1W8Fc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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