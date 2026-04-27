export const KEYWORDS = [
  'data scientist',
  'data engineer',
  'data analyst',
];

export const LOCATION_FILTER = ['new york', 'ny', 'remote'];

// Each entry: { name, tenant, site, wd }
// URL pattern: https://{tenant}.wd{wd}.myworkdayjobs.com/wday/cxs/{tenant}/{site}/jobs
export const COMPANIES = [
  { name: 'AllianceBernstein',       tenant: 'abglobal',          site: 'alliancebernsteincareers', wd: 1 },
  { name: 'BlackRock',               tenant: 'blackrock',         site: 'BlackRock_Professional',   wd: 1 },
  { name: 'Dimensional Fund Advisors', tenant: 'dimensional',     site: 'DFA_Careers',              wd: 5 },
  { name: 'Fidelity Investments',    tenant: 'fmr',               site: 'FidelityCareers',          wd: 1 },
  { name: 'Franklin Templeton',      tenant: 'franklintempleton', site: 'Primary-External-1',       wd: 5 },
  { name: 'Invesco',                 tenant: 'invesco',           site: 'IVZ',                      wd: 1 },
  { name: 'Macquarie',               tenant: 'mq',                site: 'CareersatMQ',              wd: 3 },
  { name: 'Manulife',                tenant: 'manulife',          site: 'MFCJH_Jobs',               wd: 3 },
  { name: 'Morgan Stanley',          tenant: 'ms',                site: 'External',                 wd: 5 },
  { name: 'Northern Trust',          tenant: 'ntrs',              site: 'northerntrust',            wd: 1 },
  { name: 'State Street',            tenant: 'statestreet',       site: 'Global',                   wd: 1 },
  { name: 'T. Rowe Price',           tenant: 'troweprice',        site: 'TRowePrice',               wd: 5 },
  { name: 'TIAA / Nuveen',           tenant: 'tiaa',              site: 'Search',                   wd: 1 },
  { name: 'Vanguard',                tenant: 'vanguard',          site: 'vanguard_external',        wd: 5 },
  { name: 'Wellington Management',   tenant: 'wellington',        site: 'External',                 wd: 5 },
];
