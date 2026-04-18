export const KEYWORDS = [
  'data scientist',
  'data engineer',
];

export const LOCATION_FILTER = ['new york', 'ny', 'remote'];

// Each entry: { name, tenant, site, wd }
// URL pattern: https://{tenant}.wd{wd}.myworkdayjobs.com/wday/cxs/{tenant}/{site}/jobs
export const COMPANIES = [
  { name: 'BlackRock',      tenant: 'blackrock',      site: 'BlackRock',                    wd: 1 },
  { name: 'Goldman Sachs',  tenant: 'goldmansachs',   site: 'GS_External_Career_Site',      wd: 1 },
  { name: 'JPMorgan Chase', tenant: 'jpmc',            site: 'JPMCCareers',                  wd: 5 },
  { name: 'Morgan Stanley', tenant: 'morganstanley',   site: 'Experienced',                  wd: 1 },
  { name: 'Two Sigma',      tenant: 'twosigma',        site: 'TwoSigmaExternalSite',         wd: 5 },
  { name: 'Citadel',        tenant: 'citadel',         site: 'Citadel_Careers',              wd: 1 },
  { name: 'Point72',        tenant: 'point72',         site: 'Point72ExternalCareers',       wd: 1 },
  { name: 'Vanguard',       tenant: 'vanguard',        site: 'VG',                           wd: 5 },
  { name: 'State Street',   tenant: 'statestreet',     site: 'Global',                       wd: 1 },
];
