-- 004_produits.sql

-- ============================================================
-- Table : produits
-- Catalogue de vos produits, associés à une catégorie qui matche
-- celle renvoyée par GPT-4o dans le diagnostic (voir analyze-lawn).
-- Lecture publique (catalogue, pas de donnée sensible), écriture
-- réservée au service_role (vous gérez le catalogue manuellement
-- ou via un futur back-office admin).
-- ============================================================
create table if not exists produits (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  categorie text not null,
  -- 'engrais_azote' | 'engrais_equilibre' | 'engrais_automne' |
  -- 'fongicide' | 'scarificateur' | 'aerateur' | 'semences' |
  -- 'arrosage' | 'chaux' | 'desherbant'
  description text,
  prix numeric(10,2),
  image_url text,
  lien_externe text not null, -- URL Amazon, Shopify, votre site...
  actif boolean not null default true,
  created_at timestamptz not null default now()
);

alter table produits enable row level security;

create policy "Catalogue produits visible par tous"
  on produits for select
  to authenticated
  using (actif = true);

create index if not exists idx_produits_categorie on produits (categorie);

-- ============================================================
-- Exemples de produits (à remplacer par votre vrai catalogue)
-- ============================================================
insert into produits (nom, categorie, description, prix, lien_externe) values
  ('Engrais gazon printemps 10kg', 'engrais_azote', 'Riche en azote, libération lente', 24.90, 'https://www.amazon.fr/votre-lien-engrais-azote'),
  ('Engrais gazon équilibré NPK 8kg', 'engrais_equilibre', 'Pour la croissance générale', 21.90, 'https://www.amazon.fr/votre-lien-engrais-equilibre'),
  ('Engrais gazon automne 10kg', 'engrais_automne', 'Faible azote, riche potasse', 26.90, 'https://www.amazon.fr/votre-lien-engrais-automne'),
  ('Scarificateur électrique', 'scarificateur', 'Élimine mousse et feutre', 89.00, 'https://www.amazon.fr/votre-lien-scarificateur'),
  ('Aérateur à fourche manuel', 'aerateur', 'Décompacte le sol en profondeur', 34.50, 'https://www.amazon.fr/votre-lien-aerateur'),
  ('Semences gazon regarnissage 1kg', 'semences', 'Germination rapide, zones dégarnies', 14.90, 'https://www.amazon.fr/votre-lien-semences'),
  ('Tuyau arrosage + programmateur', 'arrosage', 'Arrosage automatique programmable', 45.00, 'https://www.amazon.fr/votre-lien-arrosage'),
  ('Chaux pour gazon 5kg', 'chaux', 'Corrige le pH acide du sol', 18.90, 'https://www.amazon.fr/votre-lien-chaux'),
  ('Fongicide gazon professionnel', 'fongicide', 'Traitement maladies fongiques sévères', 32.90, 'https://www.amazon.fr/votre-lien-fongicide')
on conflict do nothing;
