-- 004-migration-est-archive.sql : archivage (« soft delete ») des personnes
--   * personne.est_archive : TRUE = compte archivé (la ligne et son historique sont conservés)
--
-- Les comptes déjà en base ne sont pas archivés : DEFAULT FALSE + NOT NULL
-- (Postgres 11+ : pas de réécriture de la table, l'ajout est instantané).

BEGIN;

ALTER TABLE "personne"
ADD COLUMN "est_archive" BOOLEAN NOT NULL DEFAULT FALSE;

COMMIT;
