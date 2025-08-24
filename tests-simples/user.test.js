const mongoose = require('mongoose');

// Mock de la connexion MongoDB
mongoose.connect = jest.fn();
mongoose.connection = {
  close: jest.fn(),
};

// Mock bcrypt pour les tests
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  genSalt: jest.fn(),
  hash: jest.fn(),
}));

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
        classe: 'S',
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
        classe: 'S',
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
        classe: 'S',
      };

      const user = new User(userData);

      const validationError = user.validateSync();
      expect(validationError).toBeDefined();
      expect(validationError.errors.niveau).toBeDefined();
    });
  });

  describe('Méthodes du modèle', () => {
    describe('isProfileComplete', () => {
      test('devrait avoir une méthode isProfileComplete', () => {
        const user = new User({
          nom: 'Test',
          prenom: 'User',
          email: 'test@example.com',
          password: 'password123',
          niveau: 'lycée',
          classe: '1ère',
        });

        expect(typeof user.isProfileComplete).toBe('function');
      });

      test('devrait retourner false pour authProvider invalide', () => {
        const user = new User({
          nom: 'Test',
          prenom: 'User',
          email: 'test@example.com',
          niveau: 'lycée',
          classe: '1ère',
          authProvider: 'invalid',
        });

        expect(user.isProfileComplete()).toBe(false);
      });
    });

    describe('comparePassword', () => {
      test('devrait retourner false pour utilisateur Google', async () => {
        const user = new User({
          nom: 'Test',
          prenom: 'User',
          email: 'test@example.com',
          googleId: 'google123',
          authProvider: 'google',
        });

        const result = await user.comparePassword('anypassword');
        expect(result).toBe(false);
      });

      test('devrait comparer les mots de passe pour utilisateur local', async () => {
        // Mock bcrypt.compare
        const bcrypt = require('bcryptjs');
        bcrypt.compare = jest.fn().mockResolvedValue(true);

        const user = new User({
          nom: 'Test',
          prenom: 'User',
          email: 'test@example.com',
          password: 'hashedpassword',
          authProvider: 'local',
        });

        const result = await user.comparePassword('password123');
        expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
        expect(result).toBe(true);
      });
    });

    describe('canUsePassword', () => {
      test('devrait avoir une méthode canUsePassword', () => {
        const user = new User({
          email: 'test@example.com',
          password: 'password123',
          authProvider: 'local',
        });

        expect(typeof user.canUsePassword).toBe('function');
      });

      test('devrait retourner false pour utilisateur Google', () => {
        const user = new User({
          email: 'test@example.com',
          googleId: 'google123',
          authProvider: 'google',
        });

        expect(user.canUsePassword()).toBe(false);
      });
    });

    describe('canUseGoogle', () => {
      test('devrait avoir une méthode canUseGoogle', () => {
        const user = new User({
          email: 'test@example.com',
          googleId: 'google123',
          authProvider: 'google',
        });

        expect(typeof user.canUseGoogle).toBe('function');
      });

      test('devrait retourner false pour utilisateur local', () => {
        const user = new User({
          email: 'test@example.com',
          password: 'password123',
          authProvider: 'local',
        });

        expect(user.canUseGoogle()).toBe(false);
      });
    });

    describe('mergeWithGoogle', () => {
      test('devrait fusionner avec profil Google complet', () => {
        const user = new User({
          email: 'test@example.com',
          authProvider: 'local',
        });

        const googleProfile = {
          id: 'google123',
          name: {
            familyName: 'Dupont',
            givenName: 'Jean',
          },
          photos: [{ value: 'https://avatar.url' }],
        };

        user.mergeWithGoogle(googleProfile);

        expect(user.googleId).toBe('google123');
        expect(user.authProvider).toBe('google');
        expect(user.avatar).toBe('https://avatar.url');
        expect(user.nom).toBe('Dupont');
        expect(user.prenom).toBe('Jean');
      });

      test('devrait fusionner avec profil Google sans photos', () => {
        const user = new User({
          email: 'test@example.com',
          authProvider: 'local',
        });

        const googleProfile = {
          id: 'google123',
          name: {
            familyName: 'Dupont',
            givenName: 'Jean',
          },
        };

        user.mergeWithGoogle(googleProfile);

        expect(user.googleId).toBe('google123');
        expect(user.authProvider).toBe('google');
        expect(user.avatar).toBeUndefined();
      });

      test('devrait préserver les noms existants', () => {
        const user = new User({
          nom: 'ExistingNom',
          prenom: 'ExistingPrenom',
          email: 'test@example.com',
          authProvider: 'local',
        });

        const googleProfile = {
          id: 'google123',
          name: {
            familyName: 'Dupont',
            givenName: 'Jean',
          },
        };

        user.mergeWithGoogle(googleProfile);

        expect(user.nom).toBe('ExistingNom');
        expect(user.prenom).toBe('ExistingPrenom');
      });

      test('devrait fusionner avec profil Google sans noms', () => {
        const user = new User({
          email: 'test@example.com',
          authProvider: 'local',
        });

        const googleProfile = {
          id: 'google123',
        };

        user.mergeWithGoogle(googleProfile);

        expect(user.googleId).toBe('google123');
        expect(user.authProvider).toBe('google');
      });
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
