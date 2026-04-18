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

function parsePostedOn(postedOn) {
  if (!postedOn) return null;
  const s = postedOn.toLowerCase();
  const now = new Date();
  if (s.includes('today')) return now.toISOString();
  if (s.includes('yesterday')) {
    now.setDate(now.getDate() - 1);
    return now.toISOString();
  }
  const match = s.match(/(\d+)\+?\s+day/);
  if (match) {
    now.setDate(now.getDate() - parseInt(match[1], 10));
    return now.toISOString();
  }
  return null;
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
    posted_at: parsePostedOn(job.postedOn),
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

    if (offset === 0 && postings.length > 0) {
      console.log(`[search] ${company.name} sample postedOn: "${postings[0].postedOn}" | keys: ${Object.keys(postings[0]).join(', ')}`);
    }

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
