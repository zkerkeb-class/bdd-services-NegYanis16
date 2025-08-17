const mongoose = require('mongoose');

// Mock de la connexion MongoDB
mongoose.connect = jest.fn();
mongoose.connection = {
  close: jest.fn()
};

// Import du modèle User
const User = require('../src/models/User');

describe('Modèle User - Tests Simples', () => {
  
  describe('Validation des données', () => {
    test('devrait valider un utilisateur avec des données correctes', () => {
      const userData = {
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean.dupont@test.com',
        password: 'motdepasse123',
        niveau: 'Terminale',
        classe: 'S'
      };

      const user = new User(userData);
      
      expect(user.nom).toBe('Dupont');
      expect(user.prenom).toBe('Jean');
      expect(user.email).toBe('jean.dupont@test.com');
      expect(user.niveau).toBe('Terminale');
      expect(user.classe).toBe('S');
    });

    test('devrait rejeter un mot de passe trop court', () => {
      const userData = {
        nom: 'Test',
        prenom: 'User',
        email: 'test@example.com',
        password: '123',
        niveau: 'Terminale',
        classe: 'S'
      };

      const user = new User(userData);
      
      const validationError = user.validateSync();
      expect(validationError).toBeDefined();
      expect(validationError.errors.password).toBeDefined();
    });

    test('devrait rejeter un niveau invalide', () => {
      const userData = {
        nom: 'Test',
        prenom: 'User',
        email: 'test@example.com',
        password: 'password123',
        niveau: 'NiveauInvalide',
        classe: 'S'
      };

      const user = new User(userData);
      
      const validationError = user.validateSync();
      expect(validationError).toBeDefined();
      expect(validationError.errors.niveau).toBeDefined();
    });
  });

  describe('Méthodes du modèle', () => {
    test('devrait vérifier si le profil est complet', () => {
      const user = new User({
        nom: 'Test',
        prenom: 'User',
        email: 'test@example.com',
        password: 'password123',
        niveau: 'Terminale',
        classe: 'S'
      });

      // Vérifier que les champs requis sont présents
      expect(user.nom).toBeDefined();
      expect(user.prenom).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.niveau).toBeDefined();
      expect(user.classe).toBeDefined();
    });

    test('devrait vérifier si le profil est incomplet', () => {
      const user = new User({
        nom: 'Test',
        prenom: 'User',
        email: 'test@example.com',
        password: 'password123'
        // Pas de niveau ni de classe
      });

      // Vérifier que les champs optionnels sont absents (null ou undefined)
      expect(user.niveau).toBeNull();
      expect(user.classe).toBeNull();
    });
  });

  describe('Structure du schéma', () => {
    test('devrait avoir les bonnes propriétés dans le schéma', () => {
      const userSchema = User.schema;
      
      expect(userSchema.paths.nom).toBeDefined();
      expect(userSchema.paths.prenom).toBeDefined();
      expect(userSchema.paths.email).toBeDefined();
      expect(userSchema.paths.password).toBeDefined();
      expect(userSchema.paths.niveau).toBeDefined();
      expect(userSchema.paths.classe).toBeDefined();
    });
  });
}); 