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
    .upsert(jobs, { onConflict: 'id', ignoreDuplicates: true });
  if (error) throw new Error(`Supabase upsert error: ${error.message}`);
}

// Returns jobs first seen in the last 25 hours (buffer for cron timing drift)
export async function getNewJobs() {
  const since = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();
  const { data, error } = await client()
    .from('jobs')
    .select('*')
    .gte('first_seen_at', since)
    .order('keyword')
    .order('company');
  if (error) throw new Error(`Supabase select error: ${error.message}`);
  return data;
}
