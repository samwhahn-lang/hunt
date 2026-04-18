import { COMPANIES, KEYWORDS, LOCATION_FILTER } from './config.js';

function workdayUrl(company) {
  return `https://${company.tenant}.wd${company.wd}.myworkdayjobs.com/wday/cxs/${company.tenant}/${company.site}/jobs`;
}

function jobUrl(company, externalPath) {
  return `https://${company.tenant}.wd${company.wd}.myworkdayjobs.com/en-US/${company.site}${externalPath}`;
}

function matchesLocation(job) {
  const loc = (job.locationsText ?? '').toLowerCase();
  return LOCATION_FILTER.some(term => loc.includes(term));
}

function normalize(job, company, keyword) {
  const loc = job.locationsText ?? '';
  const isRemote = loc.toLowerCase().includes('remote');
  const city = isRemote ? null : (loc.split(',')[0].trim() || null);
  return {
    id: `${company.tenant}-${job.externalPath}`,
    title: job.title,
    company: company.name,
    city,
    remote: isRemote,
    url: jobUrl(company, job.externalPath),
    posted_at: null,
    keyword,
  };
}

async function searchCompany(company, keyword) {
  const url = workdayUrl(company);
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
      console.warn(`[search] ${company.name}: network error — ${err.message}`);
      break;
    }

    if (!res.ok) {
      console.warn(`[search] ${company.name}: HTTP ${res.status}`);
      break;
    }

    const data = await res.json();
    const postings = data.jobPostings ?? [];
    if (!postings.length) break;

    for (const job of postings) {
      if (matchesLocation(job)) {
        results.push(normalize(job, company, keyword));
      }
    }

    if (offset + limit >= (data.total ?? 0)) break;
    offset += limit;
  }

  return results;
}

export async function searchJobs(keyword) {
  const all = [];
  const seen = new Set();

  for (const company of COMPANIES) {
    const jobs = await searchCompany(company, keyword);
    for (const job of jobs) {
      if (!seen.has(job.id)) {
        seen.add(job.id);
        all.push(job);
      }
    }
  }

  return all;
}
