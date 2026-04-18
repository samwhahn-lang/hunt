import { KEYWORDS } from './config.js';
import { searchJobs } from './search.js';
import { upsertJobs, getAllJobs, deleteStaleJobs } from './db.js';
import { renderPage } from './render.js';

async function run() {
  console.log(`[hunt] Starting — ${new Date().toISOString()}`);
  console.log(`[hunt] Keywords: ${KEYWORDS.join(', ')}`);

  for (const keyword of KEYWORDS) {
    console.log(`[hunt] Searching: "${keyword}"`);
    const jobs = await searchJobs(keyword);
    console.log(`[hunt]   Found ${jobs.length} jobs`);
    await upsertJobs(jobs);
  }

  const allJobs = await getAllJobs();
  console.log(`[hunt] Total in DB: ${allJobs.length}`);

  renderPage(allJobs);
  console.log(`[hunt] index.html written`);

  const purged = await deleteStaleJobs();
  console.log(`[hunt] Purged ${purged} stale jobs (>7 days)`);

  console.log(`[hunt] Done`);
}

run().catch(err => {
  console.error('[hunt] Fatal:', err.message);
  process.exit(1);
});
