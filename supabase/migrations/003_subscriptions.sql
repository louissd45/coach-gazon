-- 003_subscriptions.sql

-- ============================================================
-- Table : subscriptions
-- Reflète l'état d'abonnement Stripe pour chaque utilisateur.
-- Mise à jour exclusivement par le webhook Stripe (service_role),
-- jamais directement par le client.
-- ============================================================
create table if not exists subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null default 'inactive',
  -- 'inactive' | 'active' | 'past_due' | 'canceled'
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table subscriptions enable row level security;

create policy "Un utilisateur lit son propre abonnement"
  on subscriptions for select
  to authenticated
  using (auth.uid() = user_id);

-- Pas de policy insert/update pour 'authenticated' : seul le webhook
-- (clé service_role, qui contourne RLS) peut modifier ces lignes.
-- Cela évite qu'un utilisateur ne s'auto-déclare "actif" depuis le client.

-- Fonction utilitaire : un abonnement est valide s'il est actif ET
-- que la période en cours n'est pas expirée (sécurité en cas de
-- webhook manqué avant l'annulation effective chez Stripe).
create or replace function has_active_subscription(uid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from subscriptions
    where user_id = uid
      and status = 'active'
      and (current_period_end is null or current_period_end > now())
  );
$$;
