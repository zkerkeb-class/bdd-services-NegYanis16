# Service Base de Données (BDD)

## 📋 Description

Microservice dédié aux opérations en base de données MongoDB pour la plateforme éducative. Gère les utilisateurs, quiz, résultats et toutes les données métier de l'application.

## 🏗️ Architecture

- **Type** : Microservice Node.js
- **Base de données** : MongoDB avec Mongoose ODM
- **API** : REST API Express.js
- **Authentification** : JWT + Middleware de sécurité
- **Validation** : Joi pour la validation des données

## 🚀 Installation et Démarrage

### Prérequis

- Node.js 16+
- MongoDB 5+
- npm ou yarn

### Installation

```bash
# Cloner le repository
git clone [url-du-repo]

# Installer les dépendances
cd bdd-services-NegYanis16
npm install

# Configuration des variables d'environnement
cp .env.example .env
# Éditer .env avec vos paramètres
```

### Variables d'environnement

```env
# Base de données
MONGODB_URI=mongodb://localhost:27017/education_platform
MONGODB_URI_TEST=mongodb://localhost:27017/education_platform_test

# Sécurité
JWT_SECRET=votre_secret_jwt_super_securise
SESSION_SECRET=votre_secret_session

# Serveur
PORT=3001
NODE_ENV=development
```

### Démarrage

```bash
# Mode développement
npm run dev

# Mode production
npm start

# Tests
npm test
```

## 📊 Modèles de Données

### User (Utilisateur)

- **Informations personnelles** : nom, prénom, email, mot de passe
- **Profil éducatif** : niveau, classe, matières préférées
- **Sécurité** : mot de passe hashé, tokens de session

### Quiz

- **Métadonnées** : niveau, matière, titre, description
- **Questions** : texte, type (QCM/ouverte), options, réponse correcte
- **Configuration** : poids des questions, temps limite

### Results (Résultats)

- **Données de quiz** : utilisateur, quiz, réponses données
- **Calculs** : score, pourcentage, temps passé
- **Historique** : date de passage, tentatives

## 🔌 API Endpoints

### Users

- `GET /api/users` - Liste des utilisateurs
- `GET /api/users/:id` - Détails d'un utilisateur
- `POST /api/users` - Créer un utilisateur
- `PUT /api/users/:id` - Modifier un utilisateur
- `DELETE /api/users/:id` - Supprimer un utilisateur

### Quiz

- `GET /api/quiz` - Liste des quiz
- `GET /api/quiz/:id` - Détails d'un quiz
- `POST /api/quiz` - Créer un quiz
- `PUT /api/quiz/:id` - Modifier un quiz
- `DELETE /api/quiz/:id` - Supprimer un quiz

### Results

- `GET /api/results` - Liste des résultats
- `GET /api/results/:id` - Détails d'un résultat
- `POST /api/results` - Créer un résultat
- `GET /api/results/user/:userId` - Résultats d'un utilisateur

## 🧪 Tests

### Structure des tests

```
tests-simples/
├── user.test.js           # Tests du modèle User
├── quiz.test.js           # Tests du modèle Quiz
├── results.test.js        # Tests du modèle Results
├── controllers.test.js     # Tests des contrôleurs
├── routes.test.js         # Tests des routes
└── validation.test.js     # Tests de validation
```

### Exécution des tests

```bash
# Tous les tests
npm test

# Tests avec rapport de couverture
npm run test:coverage

# Tests en mode watch
npm run test:watch

# Tests en mode watch avec couverture
npm run test:watch:coverage

# Générer et ouvrir le rapport de couverture
npm run coverage:report
```

### Couverture de code (Coverage)

Le projet est configuré avec des seuils de couverture minimums :

- **Branches** : 70%
- **Fonctions** : 70%
- **Lignes** : 70%
- **Instructions** : 70%

Les rapports de couverture sont générés dans le dossier `coverage/` :

- **HTML** : `coverage/lcov-report/index.html`
- **LCOV** : `coverage/lcov.info`
- **JSON** : `coverage/coverage-final.json`
- **Texte** : Affiché dans la console

### Fichiers exclus du coverage

- `src/index.js` (point d'entrée)
- `tests-simples/**` (fichiers de tests)
- `node_modules/**`
- `coverage/**`

## 🔒 Sécurité

### Mesures OWASP implémentées

- ✅ **Injection** : Validation Joi + Mongoose
- ✅ **Authentification** : JWT + Sessions sécurisées
- ✅ **Exposition de données** : Champs sensibles masqués
- ✅ **Contrôles d'accès** : Middleware d'autorisation
- ✅ **Configuration** : Variables d'environnement sécurisées
- ✅ **XSS** : En-têtes de sécurité + validation
- ✅ **Logging** : Winston pour la traçabilité

### Middlewares de sécurité

- Helmet (en-têtes de sécurité)
- CORS configuré
- Rate limiting
- Validation des entrées
- Sanitisation des données

## 📈 Performance et Monitoring

### Métriques

- Temps de réponse des requêtes
- Taux d'erreur
- Utilisation de la base de données
- Performance des requêtes

### Optimisations

- Index MongoDB optimisés
- Pagination des résultats
- Cache des requêtes fréquentes
- Pool de connexions configuré

## 🚨 Dépannage

### Problèmes courants

1. **Connexion MongoDB** : Vérifier l'URI et les permissions
2. **Variables d'environnement** : S'assurer que .env est configuré
3. **Port déjà utilisé** : Changer le PORT dans .env
4. **Tests qui échouent** : Nettoyer le cache Jest

### Logs

Les logs sont disponibles dans :

- Console (développement)
- Fichiers (production)
- Winston (structurés)

## 🔄 Déploiement

### Environnements

- **Development** : `npm run dev`
- **Production** : `npm start`
- **Test** : `npm test`

### Docker (optionnel)

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 📞 Support

- **Documentation** : Ce README
- **Issues** : Repository GitHub
- **Tests** : Suite de tests complète
- **Logs** : Winston + Console

## 📝 Changelog

### Version 1.0.0

- ✅ Modèles de données complets
- ✅ API REST complète
- ✅ Tests unitaires
- ✅ Sécurité OWASP
- ✅ Documentation

---

**Développé par NegYanis16**
