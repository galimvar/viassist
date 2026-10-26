-- seed.sql : jeu de données de démo (un seul bénéficiaire)
-- À exécuter APRÈS migration-up.sql, sur une base vide.

BEGIN;

-- ---------------------------------------------------------------
-- PERSONNES
-- 1 bénéficiaire, 1 aidante principale (admin), 1 proche,
-- 1 invitée, 3 intervenants
-- ---------------------------------------------------------------
INSERT INTO "personne" ("id", "nom", "prenom", "date_naissance", "mail", "role") VALUES
	(1, 'Lemaire',  'Odette', '1941-03-14', 'odette.lemaire@example.com', 'bénéficiaire'),
	(2, 'Lemaire',  'Claire', '1968-07-22', 'claire.lemaire@example.com', 'admin'),
	(3, 'Lemaire',  'Thomas', '1996-11-05', 'thomas.lemaire@example.com', 'proche'),
	(4, 'Bernard',  'Sophie', '1959-01-30', 'sophie.bernard@example.com', 'invité'),
	(5, 'Petit',    'Marc',   '1972-09-12', 'dr.petit@example.com',       'intervenant'),
	(6, 'Benali',   'Nadia',  '1985-04-03', 'nadia.benali@example.com',   'intervenant'),
	(7, 'Dupuis',   'Karine', '1979-12-18', 'karine.dupuis@example.com',  'intervenant');

-- ---------------------------------------------------------------
-- CATEGORIES (messages du journal)
-- ---------------------------------------------------------------
INSERT INTO "categorie" ("id", "nom") VALUES
	(1, 'Santé'),
	(2, 'Médicaments'),
	(3, 'Repas'),
	(4, 'Humeur'),
	(5, 'Logistique');

-- ---------------------------------------------------------------
-- EVENEMENTS
-- personne_id = la personne qui a créé l'événement
-- ---------------------------------------------------------------
INSERT INTO "evenement"
	("id", "nom", "date_debut", "date_fin", "heure_debut", "heure_fin", "type", "lieu", "description", "personne_id") VALUES
	(1, 'Visite du médecin traitant',  '2026-11-03', '2026-11-03', '10:00', '10:30', 'Médical',
		'à domicile',    'Visite de contrôle mensuelle du Dr Petit. Penser à préparer la liste des questions.', 2),
	(2, 'Prise de sang',               '2026-11-05', '2026-11-05', '08:00', '08:30', 'Paramédical',
		'à domicile',    'Passage de l''infirmière pour la prise de sang, patiente à jeun.', 2),
	(3, 'Aide à la toilette et courses','2026-11-06', '2026-11-06', '09:00', '11:00', 'Aide à domicile',
		'à domicile',    'Aide à la toilette puis courses de la semaine avec la liste dans l''entrée.', 2),
	(4, 'Déjeuner en famille',         '2026-11-08', '2026-11-08', '12:00', '15:00', 'Proches',
		'à domicile',    'Repas du dimanche avec Claire, Thomas et Sophie.', 2),
	(5, 'Pharmacie : ordonnance',      '2026-11-10', '2026-11-10', '16:00', '16:30', 'Autres',
		'à l''extérieur','Renouvellement de l''ordonnance et récupération du pilulier.', 2),
	(6, 'Consultation mémoire',        '2026-11-12', '2026-11-12', '14:30', '15:30', 'Médical',
		'à l''extérieur','Consultation à l''hôpital, prévoir carte vitale, ordonnances et carnet de suivi.', 2);

-- ---------------------------------------------------------------
-- PARTICIPER (qui participe à quoi)
-- ---------------------------------------------------------------
INSERT INTO "participer" ("personne_id", "evenement_id") VALUES
	(1, 1), (2, 1), (5, 1),
	(1, 2), (6, 2),
	(1, 3), (7, 3),
	(1, 4), (2, 4), (3, 4), (4, 4),
	(1, 5), (2, 5),
	(1, 6), (2, 6);

-- ---------------------------------------------------------------
-- MESSAGES (journal de suivi)
-- ---------------------------------------------------------------
INSERT INTO "message" ("id", "description", "date", "personne_id", "categorie_id", "importance") VALUES
	(1, 'Odette a bien pris ses médicaments du matin, sans difficulté.',                          '2026-10-20', 7, 2, 'faible'),
	(2, 'Elle a peu mangé à midi, elle semblait fatiguée. À surveiller les prochains jours.',     '2026-10-21', 7, 3, 'moyenne'),
	(3, 'Moment de confusion en fin d''après-midi : elle m''a demandé où était son mari.',        '2026-10-22', 2, 4, 'élevée'),
	(4, 'Tension prise ce matin : 13/8, rien d''anormal.',                                        '2026-10-23', 6, 1, 'faible'),
	(5, 'Plus de pilulier pour la semaine prochaine, passer à la pharmacie avant mardi.',         '2026-10-24', 2, 5, 'moyenne'),
	(6, 'Très bonne humeur aujourd''hui, elle a fait sa promenade avec Sophie.',                  '2026-10-25', 4, 4, 'faible');

-- ---------------------------------------------------------------
-- Réaligne les séquences d'identité après les INSERT à ids explicites
-- (sinon le prochain INSERT sans id échouerait sur une clé déjà prise)
-- ---------------------------------------------------------------
SELECT setval(pg_get_serial_sequence('"personne"',   'id'), (SELECT MAX("id") FROM "personne"));
SELECT setval(pg_get_serial_sequence('"categorie"',  'id'), (SELECT MAX("id") FROM "categorie"));
SELECT setval(pg_get_serial_sequence('"evenement"',  'id'), (SELECT MAX("id") FROM "evenement"));
SELECT setval(pg_get_serial_sequence('"message"',    'id'), (SELECT MAX("id") FROM "message"));

COMMIT;