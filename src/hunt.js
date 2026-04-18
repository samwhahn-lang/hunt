import { KEYWORDS } from './config.js';
import { searchJobs } from './search.js';
import { upsertJobs, getNewJobs } from './db.js';
import { sendReport } from './notify.js';

async function run() {
  console.log(`[hunt] Starting — ${new Date().toISOString()}`);
  console.log(`[hunt] Keywords: ${KEYWORDS.join(', ')}`);

  for (const keyword of KEYWORDS) {
    console.log(`[hunt] Searching: "${keyword}"`);
    const jobs = await searchJobs(keyword);
    console.log(`[hunt]   Found ${jobs.length} jobs`);
    await upsertJobs(jobs);
  }

  const newJobs = await getNewJobs();
  console.log(`[hunt] New since last run: ${newJobs.length}`);

  if (newJobs.length > 0) {
    await sendReport(newJobs);
    console.log(`[hunt] Email sent`);
  } else {
    console.log(`[hunt] No new jobs — skipping email`);
  }

  console.log(`[hunt] Done`);
}

run().catch(err => {
  console.error('[hunt] Fatal:', err.message);
  process.exit(1);
});
