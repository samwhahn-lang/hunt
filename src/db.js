import { createClient } from '@supabase/supabase-js';

let _client;

function client() {
  if (!_client) {
    _client = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
    );
  }
  return _client;
}

export async function upsertJobs(jobs) {
  if (!jobs.length) return;
  const { error } = await client()
    .from('jobs')
    .upsert(jobs, { onConflict: 'id' });
  if (error) throw new Error(`Supabase upsert error: ${error.message}`);
}

export async function deleteStaleJobs() {
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { error, count } = await client()
    .from('jobs')
    .delete({ count: 'exact' })
    .lt('first_seen_at', cutoff);
  if (error) throw new Error(`Supabase delete error: ${error.message}`);
  return count ?? 0;
}

export async function getAllJobs() {
  const { data, error } = await client()
    .from('jobs')
    .select('*')
    .order('first_seen_at', { ascending: false });
  if (error) throw new Error(`Supabase select error: ${error.message}`);
  return data;
}
