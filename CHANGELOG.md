# Changelog - Service BDD

## [Non publié]

---

## [1.2.0] - 2025-01-24

### Ajouté

- **Couverture de code complète** : Configuration Jest avec seuils de 70%
- **Tests exhaustifs** : 111 tests avec 93.46% de couverture d'instructions
- **Tests des controllers** : Couverture complète (100%) de tous les controllers
- **Tests des modèles** : Tests approfondis du modèle User avec toutes ses méthodes
- **Scripts de coverage** : `npm run test:coverage`, `test:watch:coverage`, `coverage:report`
- **Rapports de couverture** : HTML, LCOV, JSON et texte
- **Documentation coverage** : Section dédiée dans le README

### Modifié

- **Configuration Jest** : Seuils de couverture à 70% minimum
- **Structure des tests** : Réorganisation avec fichiers séparés par controller
- **Timeout des tests** : Augmenté à 15 secondes pour la stabilité
- **Exclusions coverage** : Point d'entrée et fichiers de tests exclus

### Métriques de couverture atteintes

- **Instructions** : 93.46% (seuil : 70%) ✅
- **Branches** : 79.1% (seuil : 70%) ✅
- **Fonctions** : 95.83% (seuil : 70%) ✅
- **Lignes** : 93.22% (seuil : 70%) ✅

---

## [1.1.0] - 2025-01-24

### Ajouté

- Système de versioning automatique avec npm scripts
- Validation du code (ESLint + Prettier) avant release
- Tests automatiques avant chaque release

### Modifié

- Amélioration du workflow de développement
- Formatage du code avec Prettier

---

## [1.0.0] - 2025-07-10

### Ajouté

- API RESTful complète pour la gestion des données
- Gestion des utilisateurs (CRUD complet)
- Gestion des quiz (création, modification, suppression)
- Gestion des résultats (stockage et récupération des scores)
- Base de données MongoDB avec Mongoose
- Validation des données avec Joi
- Tests unitaires avec Jest (54 tests)
- Qualité du code avec ESLint et Prettier
- Sécurité avec Helmet et rate limiting
- Logging avec Winston

### Endpoints disponibles

- **Users**: `GET|POST|PUT|DELETE /api/users`
- **Quiz**: `GET|POST|PUT|DELETE /api/quiz`
- **Results**: `GET|POST /api/results`
