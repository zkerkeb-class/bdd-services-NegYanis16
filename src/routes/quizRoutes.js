const express = require('express');
const {
  createQuiz,
  getQuizById,
  getQuizzesByUser,
  getQuizzesBySubject,
  deleteQuiz
} = require('../controllers/quizController');

const router = express.Router();

// Créer un quiz
router.post('/', createQuiz);

// Récupérer un quiz par ID
router.get('/:id', getQuizById);

// Récupérer tous les quiz d'un utilisateur
router.get('/user/:userId', getQuizzesByUser);

// Récupérer tous les quiz d'une matière pour un utilisateur
router.get('/user/:userId/subject/:subject', getQuizzesBySubject);

// Supprimer un quiz
router.delete('/:id', deleteQuiz);

module.exports = router; 