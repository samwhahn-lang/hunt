import { COMPANIES, LOCATION_FILTER } from './config.js';

// — shared —

function matchesLocation(locText) {
  const loc = (locText ?? '').toLowerCase();
  return LOCATION_FILTER.some(term => loc.includes(term));
}

// — Workday —

function workdayApiUrl(c) {
  return `https://${c.tenant}.wd${c.wd}.myworkdayjobs.com/wday/cxs/${c.tenant}/${c.site}/jobs`;
}

function workdayJobUrl(c, externalPath) {
  return `https://${c.tenant}.wd${c.wd}.myworkdayjobs.com/en-US/${c.site}${externalPath}`;
}

function parsePostedOn(postedOn) {
  if (!postedOn) return null;
  const s = postedOn.toLowerCase();
  const now = new Date();
  if (s.includes('today')) return now.toISOString();
  if (s.includes('yesterday')) { now.setDate(now.getDate() - 1); return now.toISOString(); }
  const m = s.match(/(\d+)\+?\s+day/);
  if (m) { now.setDate(now.getDate() - parseInt(m[1], 10)); return now.toISOString(); }
  return null;
}

async function searchWorkday(company, keyword) {
  const url = workdayApiUrl(company);
  let offset = 0;
  const limit = 20;
  const results = [];

  while (true) {
    let res;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appliedFacets: {}, limit, offset, searchText: keyword }),
      });
    } catch (err) {
      console.warn(`[search] ${company.name}: network error`);
      break;
    }
    if (!res.ok) { console.warn(`[search] ${company.name}: HTTP ${res.status}`); break; }

    const data = await res.json();
    const postings = data.jobPostings ?? [];
    if (!postings.length) break;

    for (const job of postings) {
      if (matchesLocation(job.locationsText)) {
        const loc = job.locationsText ?? '';
        const isRemote = loc.toLowerCase().includes('remote');
        results.push({
          id: `${company.tenant}-${job.externalPath}`,
          title: job.title,
          company: company.name,
          city: isRemote ? null : (loc.split(',')[0].trim() || null),
          remote: isRemote,
          url: workdayJobUrl(company, job.externalPath),
          posted_at: parsePostedOn(job.postedOn),
          keyword,
        });
      }
    }

    if (offset + limit >= (data.total ?? 0)) break;
    offset += limit;
  }

  return results;
}

// — Greenhouse —

async function searchGreenhouse(company, keyword) {
  let res;
  try {
    res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${company.boardToken}/jobs`);
  } catch (err) {
    console.warn(`[search] ${company.name}: network error`);
    return [];
  }
  if (!res.ok) { console.warn(`[search] ${company.name}: HTTP ${res.status}`); return []; }

  const data = await res.json();
  const kw = keyword.toLowerCase();
  const results = [];

  for (const job of data.jobs ?? []) {
    if (!job.title.toLowerCase().includes(kw)) continue;
    if (!matchesLocation(job.location?.name)) continue;

    const loc = job.location?.name ?? '';
    const isRemote = loc.toLowerCase().includes('remote');
    results.push({
      id: `gh-${company.boardToken}-${job.id}`,
      title: job.title,
      company: company.name,
      city: isRemote ? null : (loc.split(',')[0].trim() || null),
      remote: isRemote,
      url: job.absolute_url ?? null,
      posted_at: job.updated_at ?? null,
      keyword,
    });
  }

  return results;
}

// — orchestrator —

export async function searchJobs(keyword) {
  const all = [];
  const seen = new Set();
  const noResults = [];

  for (const company of COMPANIES) {
    const jobs = company.platform === 'greenhouse'
      ? await searchGreenhouse(company, keyword)
      : await searchWorkday(company, keyword);

    if (jobs.length === 0) noResults.push(company.name);

    for (const job of jobs) {
      if (!seen.has(job.id)) {
        seen.add(job.id);
        all.push(job);
      }
    }
  }

  return { jobs: all, noResults };
}
