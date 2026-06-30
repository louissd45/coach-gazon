-- 006_fiches_images.sql

alter table fiches_connaissances
  add column if not exists image_url text;
