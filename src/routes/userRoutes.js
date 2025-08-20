const express = require('express');
const {
  getUserByEmail,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  updateTokens,
  verifyPassword,
} = require('../controllers/userController');

const router = express.Router();

// Vérifier si un utilisateur existe par email
router.get('/email/:email', getUserByEmail);

// Créer un utilisateur
router.post('/', createUser);

// Récupérer un utilisateur par ID
router.get('/:id', getUserById);

// Mettre à jour un utilisateur
router.put('/:id', updateUser);

// Supprimer un utilisateur
router.delete('/:id', deleteUser);

// Mettre à jour les jetons
router.patch('/:id/tokens', updateTokens);

// Vérifier le mot de passe d'un utilisateur
router.post('/:id/verify-password', verifyPassword);

module.exports = router;
