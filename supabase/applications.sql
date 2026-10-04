-- =========================================================================
-- ETC applications (season 2026/27 onward).
--
-- Run once in the Supabase SQL editor. Additive only: the older registration
-- tables and their enums (registration, registerations-2k25-2k26, departments,
-- level, status, ...) are left untouched.
--
-- Open or close applications:
--   update public.registration_settings set is_open = true;   -- open
--   update public.registration_settings set is_open = false;  -- close
-- Next season:
--   update public.registration_settings set season = '2027/28', is_open = false;
-- =========================================================================

-- Enums ------------------------------------------------------------------

-- Keys match `CellKey` in src/data/cells.ts.
create type public.cell as enum
    ('development', 'ai', 'design', 'multimedia', 'events', 'marketing', 'relex');

-- Values match SCHOOLS and LEVELS in src/data/cells.ts.
create type public.school as enum
    ('ENSIA', 'ESI', 'NHSM', 'ENCS', 'NHSAST', 'ESNN', 'ESTA', 'Other');
create type public.study_year as enum ('1Y', '2Y', '3Y', '4Y', '5Y', 'Other');

create type public.application_status as enum ('pending', 'accepted', 'rejected');

-- Registration switch (single row) ----------------------------------------

create table public.registration_settings (
    id boolean primary key default true check (id), -- at most one row
    season text not null,
    is_open boolean not null default false
);
insert into public.registration_settings (season, is_open) values ('2026/27', false);

alter table public.registration_settings enable row level security;
revoke all on public.registration_settings from anon, authenticated;
grant select on public.registration_settings to anon, authenticated;
create policy "Anyone can read the registration switch"
    on public.registration_settings for select
    to anon, authenticated
    using (true);

create function public.current_season()
returns text
language sql
stable
set search_path = ''
as $$
    select season from public.registration_settings limit 1
$$;

-- Same rule as `words()` in src/components/register.tsx.
create function public.word_count(t text)
returns integer
language sql
immutable
set search_path = ''
as $$
    select case
        when t is null or t ~ '^\s*$' then 0
        else array_length(regexp_split_to_array(regexp_replace(t, '^\s+|\s+$', '', 'g'), '\s+'), 1)
    end
$$;

-- Applications -------------------------------------------------------------

create table public.applications (
    id bigint generated always as identity primary key,
    created_at timestamptz not null default now(),

    -- Filled by the database, never by the browser (see the grants below).
    season text not null default public.current_season(),
    user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
    email text not null default (auth.jwt() ->> 'email'),

    -- Identity
    first_name text not null
        check (first_name ~ '^[[:alpha:]][[:alpha:]'' -]{1,39}$'),
    last_name text not null
        check (last_name ~ '^[[:alpha:]][[:alpha:]'' -]{1,39}$' and last_name = upper(last_name)),
    school public.school not null,
    school_other text,
    level public.study_year not null,
    phone text not null check (phone ~ '^0[567][0-9]{8}$'),
    discord text check (char_length(discord) between 2 and 40),
    link_1 text check (link_1 ~* '^https?://\S+$' and char_length(link_1) <= 300),
    link_2 text check (link_2 ~* '^https?://\S+$' and char_length(link_2) <= 300),

    -- Cells, ranked. Choice 1 is required, 2 and 3 are optional.
    choice_1 public.cell not null,
    motivation_1 text not null check (public.word_count(motivation_1) between 10 and 300),
    choice_2 public.cell,
    motivation_2 text check (motivation_2 is null or public.word_count(motivation_2) between 10 and 300),
    choice_3 public.cell,
    motivation_3 text check (motivation_3 is null or public.word_count(motivation_3) between 10 and 300),

    -- Written answers
    made text not null check (public.word_count(made) between 15 and 300),
    about text not null check (public.word_count(about) between 15 and 300),
    why text not null check (public.word_count(why) between 15 and 300),

    -- Reviewers only (edited from the Supabase dashboard)
    status public.application_status not null default 'pending',
    assigned_cell public.cell,
    reviewer_notes text,

    constraint one_application_per_season unique (user_id, season),
    constraint school_other_named check (
        (school = 'Other') = (school_other is not null and char_length(btrim(school_other)) between 2 and 120)
    ),
    constraint choice_2_has_motivation check ((choice_2 is null) = (motivation_2 is null)),
    constraint choice_3_has_motivation check ((choice_3 is null) = (motivation_3 is null)),
    constraint choices_in_order check (choice_3 is null or choice_2 is not null),
    constraint choices_distinct check (
        choice_2 is distinct from choice_1
        and (choice_3 is null or (choice_3 <> choice_1 and choice_3 <> choice_2))
    )
);

alter table public.applications enable row level security;

-- Applicants may write only the fields of the form, and read back only enough
-- to know they already applied. Status and reviewer notes stay private.
revoke all on public.applications from anon, authenticated;
grant insert (
    first_name, last_name, school, school_other, level, phone, discord, link_1, link_2,
    choice_1, motivation_1, choice_2, motivation_2, choice_3, motivation_3,
    made, about, why
) on public.applications to authenticated;
grant select (id, season, created_at) on public.applications to authenticated;

create policy "Applicants apply for themselves while registration is open"
    on public.applications for insert
    to authenticated
    with check (
        user_id = (select auth.uid())
        and email = (select auth.jwt() ->> 'email')
        and exists (
            select 1 from public.registration_settings s
            where s.is_open and s.season = applications.season
        )
    );

create policy "Applicants see their own applications"
    on public.applications for select
    to authenticated
    using (user_id = (select auth.uid()));
