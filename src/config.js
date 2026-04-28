export const KEYWORDS = [
  'data scientist',
  'data engineer',
  'data analyst',
];

export const LOCATION_FILTER = ['new york', 'ny', 'remote'];

export const STALE_DAYS = 30;

// Workday: { name, platform:'workday', tenant, site, wd }
// Greenhouse: { name, platform:'greenhouse', boardToken }
export const COMPANIES = [
  // — Workday —
  { name: 'AllianceBernstein',         platform: 'workday',     tenant: 'abglobal',          site: 'alliancebernsteincareers', wd: 1 },
  { name: 'BlackRock',                 platform: 'workday',     tenant: 'blackrock',         site: 'BlackRock_Professional',   wd: 1 },
  { name: 'Dimensional Fund Advisors', platform: 'workday',     tenant: 'dimensional',       site: 'DFA_Careers',              wd: 5 },
  { name: 'Fidelity Investments',      platform: 'workday',     tenant: 'fmr',               site: 'FidelityCareers',          wd: 1 },
  { name: 'Franklin Templeton',        platform: 'workday',     tenant: 'franklintempleton', site: 'Primary-External-1',       wd: 5 },
  { name: 'Invesco',                   platform: 'workday',     tenant: 'invesco',           site: 'IVZ',                      wd: 1 },
  { name: 'Macquarie',                 platform: 'workday',     tenant: 'mq',                site: 'CareersatMQ',              wd: 3 },
  { name: 'Manulife',                  platform: 'workday',     tenant: 'manulife',          site: 'MFCJH_Jobs',               wd: 3 },
  { name: 'Morgan Stanley',            platform: 'workday',     tenant: 'ms',                site: 'External',                 wd: 5 },
  { name: 'Northern Trust',            platform: 'workday',     tenant: 'ntrs',              site: 'northerntrust',            wd: 1 },
  { name: 'State Street',              platform: 'workday',     tenant: 'statestreet',       site: 'Global',                   wd: 1 },
  { name: 'T. Rowe Price',             platform: 'workday',     tenant: 'troweprice',        site: 'TRowePrice',               wd: 5 },
  { name: 'TIAA / Nuveen',             platform: 'workday',     tenant: 'tiaa',              site: 'Search',                   wd: 1 },
  { name: 'Vanguard',                  platform: 'workday',     tenant: 'vanguard',          site: 'vanguard_external',        wd: 5 },
  { name: 'Wellington Management',     platform: 'workday',     tenant: 'wellington',        site: 'External',                 wd: 5 },

  // — Greenhouse —
  { name: 'AQR Capital Management',    platform: 'greenhouse',  boardToken: 'aqr'       },
  { name: 'Jane Street',               platform: 'greenhouse',  boardToken: 'janestreet'},
  { name: 'Man Group',                 platform: 'greenhouse',  boardToken: 'mangroup'  },
  { name: 'Point72',                   platform: 'greenhouse',  boardToken: 'point72'   },
  { name: 'Virtu Financial',           platform: 'greenhouse',  boardToken: 'virtu'     },
];
