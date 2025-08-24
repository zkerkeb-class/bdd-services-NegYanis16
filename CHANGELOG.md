# Changelog - Service BDD

## [Non publié]

### Ajouté
- Configuration du système de versioning automatique
- Scripts npm pour la gestion des versions

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

## [1.0.0] - 2025-01-24

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
