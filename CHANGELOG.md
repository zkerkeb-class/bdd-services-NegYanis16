# Changelog - Service Base de Données

Toutes les modifications notables du service de base de données seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Versioning Sémantique](https://semver.org/lang/fr/).

---

## [Non publié]

### Ajouté
- Configuration de **Dependabot** pour les mises à jour automatiques des dépendances.
- Intégration de **lint** et **Prettier** pour assurer la qualité et la cohérence du code.
- Fichier `test.yml` pour l’intégration continue (CI).

### Modifié
- Mise à jour de `index.js` pour ajustements mineurs.
- Amélioration du pipeline GitHub Actions pour intégrer les nouveaux workflows CI/CD.

---

## [1.0.0] - 2025-07-10

### Ajouté
- **API RESTful complète** pour la gestion des données.
- **Gestion des utilisateurs** : CRUD complet avec validation.
- **Gestion des quiz** : Création, modification et suppression des quiz.
- **Gestion des résultats** : Stockage et récupération des scores.
- **Base de données MongoDB** avec Mongoose ODM.
- **Validation des données** avec Joi pour la sécurité.
- **Logging avancé** avec Winston pour le monitoring et le debugging.
- **Sécurité renforcée** avec Helmet et rate limiting.
- **Tests unitaires** avec Jest et Supertest.
- **Qualité du code** avec ESLint et Prettier.
- **Variables d'environnement** pour une configuration flexible.
- **Protection CORS** pour gérer les requêtes cross-origin.

### Fonctionnalités principales

#### Endpoints Utilisateurs
- `GET /api/users` - Liste des utilisateurs  
- `GET /api/users/:id` - Récupération d'un utilisateur  
- `POST /api/users` - Création d'un utilisateur  
- `PUT /api/users/:id` - Mise à jour d'un utilisateur  
- `DELETE /api/users/:id` - Suppression d'un utilisateur  

#### Endpoints Quiz
- `GET /api/quiz` - Liste des quiz  
- `GET /api/quiz/:id` - Récupération d'un quiz  
- `POST /api/quiz` - Création d'un quiz  
- `PUT /api/quiz/:id` - Mise à jour d'un quiz  
- `DELETE /api/quiz/:id` - Suppression d'un quiz  

#### Endpoints Résultats
- `GET /api/results` - Liste des résultats  
- `GET /api/results/user/:userId` - Résultats d'un utilisateur  
- `POST /api/results` - Enregistrement d'un résultat  
- `GET /api/results/quiz/:quizId` - Résultats d'un quiz  

---

### Architecture technique
- **Framework** : Express.js pour l'API REST  
- **Base de données** : MongoDB avec Mongoose ODM  
- **Validation** : Joi pour la validation des schémas  
- **Sécurité** : Helmet, CORS, Rate Limiting  
- **Logging** : Winston avec rotation des logs  
- **Tests** : Jest + Supertest pour les tests unitaires et d'intégration  
- **Qualité** : ESLint + Prettier pour la cohérence du code  

---

### Sécurité
- Validation stricte des données d'entrée.  
- Protection contre les attaques par déni de service (rate limiting).  
- Headers de sécurité configurés avec Helmet.  
- Hashage sécurisé des mots de passe avec bcryptjs.  
- Configuration CORS appropriée.  

---

### Performance
- Indexation optimisée des collections MongoDB.  
- Middleware de compression pour réduire le poids des réponses.  
- Gestion optimisée des connexions à la base de données.  
- Mise en cache des requêtes fréquentes.  
