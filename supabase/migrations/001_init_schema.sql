-- 001_init_schema.sql

-- ============================================================
-- Table : fiches_connaissances
-- Contient la base de connaissances (maladies, entretien...)
-- utilisée comme contexte par l'IA. Lecture publique car ce
-- n'est pas une donnée utilisateur sensible ; écriture réservée
-- aux admins (à gérer via un rôle dédié plus tard).
-- ============================================================
create table if not exists fiches_connaissances (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  categorie text not null, -- ex: 'maladie', 'entretien', 'nuisible'
  contenu text not null,
  created_at timestamptz not null default now()
);

alter table fiches_connaissances enable row level security;

create policy "Fiches visibles par tous les utilisateurs authentifiés"
  on fiches_connaissances for select
  to authenticated
  using (true);

-- ============================================================
-- Table : diagnostics
-- Historique des diagnostics de chaque utilisateur.
-- RLS stricte : chaque utilisateur ne voit QUE ses propres lignes.
-- ============================================================
create table if not exists diagnostics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  image_path text not null,
  image_url text not null,
  diagnostic jsonb not null, -- résultat structuré renvoyé par GPT-4o
  created_at timestamptz not null default now()
);

alter table diagnostics enable row level security;

create policy "Un utilisateur lit uniquement ses diagnostics"
  on diagnostics for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Un utilisateur insère uniquement ses diagnostics"
  on diagnostics for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Un utilisateur supprime uniquement ses diagnostics"
  on diagnostics for delete
  to authenticated
  using (auth.uid() = user_id);

-- ============================================================
-- Storage : bucket pour les photos de pelouse
-- Chaque utilisateur a son propre dossier ({user_id}/...) et ne
-- peut accéder qu'à ses propres fichiers.
-- ============================================================
insert into storage.buckets (id, name, public)
values ('lawn-photos', 'lawn-photos', true)
on conflict (id) do nothing;

create policy "Un utilisateur upload uniquement dans son dossier"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'lawn-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Un utilisateur lit uniquement ses propres photos"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'lawn-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
