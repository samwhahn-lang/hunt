import { writeFileSync } from 'fs';

const NEW_THRESHOLD_MS = 25 * 60 * 60 * 1000;

function isNew(job) {
  return Date.now() - new Date(job.first_seen_at).getTime() < NEW_THRESHOLD_MS;
}

function jobRow(job) {
  const location = job.remote ? 'Remote' : (job.city ?? '—');
  const posted = job.posted_at
    ? new Date(job.posted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : '—';
  const newBadge = isNew(job)
    ? '<span class="badge">NEW</span>'
    : '';
  return `
    <tr>
      <td><a href="${job.url ?? '#'}" target="_blank" rel="noopener">${job.title}</a>${newBadge}</td>
      <td>${job.company ?? '—'}</td>
      <td>${location}</td>
      <td class="muted">${posted}</td>
    </tr>`;
}

function section(keyword, jobs) {
  const newCount = jobs.filter(isNew).length;
  const newLabel = newCount > 0 ? `<span class="badge">${newCount} new</span>` : '';
  return `
    <section>
      <h2>${keyword} <span class="count">${jobs.length}</span>${newLabel}</h2>
      <table>
        <thead><tr><th>Title</th><th>Company</th><th>Location</th><th>Posted</th></tr></thead>
        <tbody>${jobs.map(jobRow).join('')}</tbody>
      </table>
    </section>`;
}

export function renderPage(jobs, outPath = 'index.html') {
  const updated = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
  });

  const byKeyword = {};
  for (const job of jobs) {
    (byKeyword[job.keyword] ??= []).push(job);
  }

  const sections = Object.entries(byKeyword)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([kw, kwJobs]) => section(kw, kwJobs))
    .join('');

  const totalNew = jobs.filter(isNew).length;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hunt</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; color: #111; background: #fafafa; padding: 32px 24px; }
    header { margin-bottom: 32px; }
    h1 { font-size: 22px; font-weight: 700; letter-spacing: -0.3px; }
    .meta { color: #888; font-size: 13px; margin-top: 4px; }
    section { margin-bottom: 40px; }
    h2 { font-size: 15px; font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
    .count { color: #888; font-weight: 400; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.07); }
    th { text-align: left; padding: 10px 14px; background: #f4f4f4; font-size: 12px; text-transform: uppercase; letter-spacing: 0.4px; color: #555; border-bottom: 1px solid #e8e8e8; }
    td { padding: 10px 14px; border-bottom: 1px solid #f0f0f0; vertical-align: middle; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #f9f9f9; }
    a { color: #0066cc; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .badge { display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: 0.3px; padding: 2px 6px; border-radius: 4px; background: #e6f0ff; color: #0055bb; margin-left: 8px; vertical-align: middle; }
    .muted { color: #999; }
    @media (max-width: 600px) { th:nth-child(3), td:nth-child(3), th:nth-child(4), td:nth-child(4) { display: none; } }
  </style>
</head>
<body>
  <header>
    <h1>Hunt</h1>
    <p class="meta">Updated ${updated} &middot; ${jobs.length} total &middot; ${totalNew} new today &middot; last 7 days</p>
  </header>
  ${sections || '<p class="muted">No results yet.</p>'}
</body>
</html>`;

  writeFileSync(outPath, html, 'utf8');
  return outPath;
}
