import { db } from '../db.js';

const EVENEMENTS = `(
  SELECT ev.id, ev.intitule, ev.date_debut, ev.date_fin, ev.heure_debut, ev.heure_fin,
         ev.lieu, ev.description,
         CASE WHEN p.id IS NULL THEN NULL
              ELSE json_build_object('id', p.id, 'prenom', p.prenom, 'nom', p.nom) END AS personne,
         CASE WHEN t.id IS NULL THEN NULL
              ELSE json_build_object('id', t.id, 'intitule', t.intitule) END AS type_evenement
  FROM evenement ev
  LEFT JOIN personne p ON p.id = ev.personne_id
  LEFT JOIN type_evenement t ON t.id = ev.type_evenement_id
)`;

export const dayQuery = async (interval) => {
	const { rows } = await db.query(
		`
        SELECT json_build_object((CURRENT_DATE + $1::int)::text,
                COALESCE((SELECT json_agg(e ORDER BY e.heure_debut)
        FROM ${EVENEMENTS} e
        WHERE e.date_debut <= CURRENT_DATE + $1::int
          AND COALESCE(e.date_fin, e.date_debut) >= CURRENT_DATE + $1::int),
        '[]'::json)) AS resultat`,
		[interval],
	);
	return rows[0].resultat;
};

export const weekQuery = async (interval) => {
	const { rows } = await db.query(
		`
        SELECT json_object_agg(jour, evenements ORDER BY jour) AS resultat
        FROM (
        SELECT d::date AS jour,
                COALESCE(json_agg(e ORDER BY e.heure_debut) FILTER (WHERE e.id IS NOT NULL), '[]'::json) AS evenements
        FROM generate_series(
                date_trunc('week', CURRENT_DATE) + $1::int * INTERVAL '1 week',
                date_trunc('week', CURRENT_DATE) + $1::int * INTERVAL '1 week' + INTERVAL '6 days',
                INTERVAL '1 day'
            ) AS d
        LEFT JOIN ${EVENEMENTS} e
          ON e.date_debut <= d::date AND COALESCE(e.date_fin, e.date_debut) >= d::date
        GROUP BY d
        ) AS jours`,
		[interval],
	);
	return rows[0].resultat;
};

export const monthQuery = async (interval) => {
	const { rows } = await db.query(
		`
        WITH bornes AS (
        SELECT m::date AS premier_jour,
                date_trunc('week', m) AS debut,
                date_trunc('week', m + INTERVAL '1 month' - INTERVAL '1 day') + INTERVAL '6 days' AS fin
        FROM (SELECT date_trunc('month', CURRENT_DATE) + $1::int * INTERVAL '1 month' AS m) AS x
        ),
        jours AS (
        SELECT d::date AS jour,
                date_trunc('week', d)::date AS lundi,
                COALESCE(json_agg(e ORDER BY e.heure_debut) FILTER (WHERE e.id IS NOT NULL), '[]'::json) AS evenements
        FROM generate_series((SELECT debut FROM bornes), (SELECT fin FROM bornes), INTERVAL '1 day') AS d
        LEFT JOIN ${EVENEMENTS} e
          ON e.date_debut <= d::date AND COALESCE(e.date_fin, e.date_debut) >= d::date
        GROUP BY d
        ),
        semaines AS (
        SELECT lundi, json_object_agg(jour, evenements ORDER BY jour) AS semaine
        FROM jours
        GROUP BY lundi
        )
        SELECT json_build_object(
        'premier_jour', (SELECT premier_jour FROM bornes),
        'mois', json_agg(semaine ORDER BY lundi)
        ) AS resultat
        FROM semaines`,
		[interval],
	);
	return rows[0].resultat;
};
