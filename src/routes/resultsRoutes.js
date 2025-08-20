const express = require('express');
const {
  createResult,
  getMoyenneParMatiere,
  getResultsByUser,
} = require('../controllers/resultsController');

const router = express.Router();

// Créer un résultat
router.post('/', createResult);

// Récupérer la moyenne des notes par matière pour un utilisateur
router.get('/moyenne/:userId', getMoyenneParMatiere);

// Récupérer tous les résultats d'un utilisateur
router.get('/user/:userId', getResultsByUser);

module.exports = router;
