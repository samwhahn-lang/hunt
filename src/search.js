import { LOCATION } from './config.js';

const BASE = 'https://api.smartrecruiters.com/v1/postings';

async function fetchPage(keyword, offset = 0) {
  const params = new URLSearchParams({
    q: keyword,
    city: LOCATION.city,
    country: LOCATION.country,
    limit: '100',
    offset: String(offset),
  });
  const res = await fetch(`${BASE}?${params}`);
  if (!res.ok) throw new Error(`SmartRecruiters error ${res.status}: ${await res.text()}`);
  return res.json();
}

async function fetchRemotePage(keyword, offset = 0) {
  const params = new URLSearchParams({
    q: `${keyword} remote`,
    country: LOCATION.country,
    limit: '100',
    offset: String(offset),
  });
  const res = await fetch(`${BASE}?${params}`);
  if (!res.ok) throw new Error(`SmartRecruiters error ${res.status}: ${await res.text()}`);
  return res.json();
}

function normalize(job, keyword) {
  return {
    id: job.id,
    title: job.name,
    company: job.company?.name ?? null,
    city: job.location?.city ?? null,
    remote: job.location?.remote ?? false,
    url: job.ref ?? null,
    posted_at: job.releasedDate ?? null,
    keyword,
  };
}

export async function searchJobs(keyword) {
  const seen = new Set();
  const jobs = [];

  const addJobs = (data) => {
    for (const job of data.content ?? []) {
      if (!seen.has(job.id)) {
        seen.add(job.id);
        jobs.push(normalize(job, keyword));
      }
    }
  };

  const cityData = await fetchPage(keyword);
  addJobs(cityData);

  const remoteData = await fetchRemotePage(keyword);
  addJobs(remoteData);

  return jobs;
}
