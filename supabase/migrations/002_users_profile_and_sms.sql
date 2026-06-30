-- 002_users_profile_and_sms.sql

-- ============================================================
-- Table : users_profile
-- Stocke téléphone, localisation (pour la météo) et consentement SMS.
-- ============================================================
create table if not exists users_profile (
  user_id uuid primary key references auth.users(id) on delete cascade,
  phone text,
  city text,
  latitude double precision,
  longitude double precision,
  sms_consent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table users_profile enable row level security;

create policy "Un utilisateur lit son propre profil"
  on users_profile for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Un utilisateur modifie son propre profil"
  on users_profile for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Un utilisateur met à jour son propre profil"
  on users_profile for update
  to authenticated
  using (auth.uid() = user_id);

-- ============================================================
-- Table : sms_log
-- Historique des SMS envoyés, pour éviter les doublons (ex: ne pas
-- renvoyer la même alerte canicule 2 jours de suite) et pour debug.
-- ============================================================
create table if not exists sms_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null, -- 'engrais' | 'canicule' | 'suivi_diagnostic'
  message text not null,
  sent_at timestamptz not null default now()
);

alter table sms_log enable row level security;

create policy "Un utilisateur lit son propre historique SMS"
  on sms_log for select
  to authenticated
  using (auth.uid() = user_id);

-- La fonction daily-check utilise la clé service_role, qui contourne
-- RLS par défaut côté serveur : aucune policy d'insert n'est donc
-- nécessaire pour elle.

-- Index utile pour la vérification rapide "déjà envoyé ce mois-ci ?"
create index if not exists idx_sms_log_user_type_date
  on sms_log (user_id, type, sent_at desc);

-- ============================================================
-- Active pg_cron + pg_net pour planifier l'appel quotidien à
-- l'Edge Function daily-check (nécessite extensions Supabase).
-- ============================================================
create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

-- Remplacez <project-ref> et <anon-or-service-key> avant exécution,
-- ou configurez ce cron directement depuis le dashboard Supabase
-- (Database > Cron Jobs) qui propose une interface guidée.
-- select cron.schedule(
--   'daily-lawn-check',
--   '0 7 * * *', -- tous les jours à 7h
--   $$
--   select net.http_post(
--     url := 'https://<project-ref>.supabase.co/functions/v1/daily-check',
--     headers := jsonb_build_object(
--       'Authorization', 'Bearer <service-role-key>',
--       'Content-Type', 'application/json'
--     )
--   );
--   $$
-- );
