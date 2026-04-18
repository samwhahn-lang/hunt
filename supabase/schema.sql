create table if not exists jobs (
  id             text        primary key,
  title          text        not null,
  company        text,
  city           text,
  remote         boolean     default false,
  url            text,
  keyword        text,
  posted_at      timestamptz,
  first_seen_at  timestamptz default now()
);

create index if not exists jobs_first_seen_at_idx on jobs (first_seen_at desc);
create index if not exists jobs_keyword_idx on jobs (keyword);
