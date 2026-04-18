export const KEYWORDS = [
  'data scientist',
  'data engineer',
];

export const LOCATION_FILTER = ['new york', 'ny', 'remote'];

// Each entry: { name, tenant, site, wd }
// URL pattern: https://{tenant}.wd{wd}.myworkdayjobs.com/wday/cxs/{tenant}/{site}/jobs
export const COMPANIES = [
  { name: 'BlackRock',      tenant: 'blackrock',    site: 'BlackRock_Professional', wd: 1 },
  { name: 'Morgan Stanley', tenant: 'ms',           site: 'External',               wd: 5 },
  { name: 'Vanguard',       tenant: 'vanguard',     site: 'vanguard_external',      wd: 5 },
  { name: 'State Street',   tenant: 'statestreet',  site: 'Global',                 wd: 1 },
];
