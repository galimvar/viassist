Date : 2026-10-13  
Statut : Accepté

## Contexte
L'équipe compte 4 personnes, le projet n'est pas encore mis en production et nous livrons une fonctionnalité à la fois.

## Options considérées
1. Gitflow : Modèle très structuré, adapté aux gros projets avec des cycles de release formels.
2. GitHub flow : Alternative plus simple à Git Flow, recommandée pour des déploiements fréquents, avec un main toujours déployable.

## Décision
Nous utilisons Gitflow, afin de développer sur une branche dev et sécuriser le main.

## Conséquences

### Avantages 
- Permet d'avoir un produit testé et sans bug apparent
- Plusieurs versions peuvent être maintenues en parallèle
- Main reste stable

### Inconvénients
- Demande une plus grande rigueur à l'équipe 
- Plus d'étapes avant déploiement
