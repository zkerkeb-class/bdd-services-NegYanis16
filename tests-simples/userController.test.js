const mongoose = require('mongoose');

// Mock du modèle User
jest.mock('../src/models/User');
const User = require('../src/models/User');

// Import du controller
const userController = require('../src/controllers/userController');

describe('UserController - Tests Complets', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();

    // Reset des mocks
    jest.clearAllMocks();
  });

  describe('getUserByEmail', () => {
    test('devrait retourner un utilisateur par email', async () => {
      const mockUser = { _id: '123', email: 'test@test.com', nom: 'Test' };
      req.params.email = 'test@test.com';

      User.findOne = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      await userController.getUserByEmail(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@test.com' });
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    test('devrait gérer les erreurs', async () => {
      const error = new Error('Erreur base de données');
      req.params.email = 'test@test.com';

      User.findOne = jest.fn().mockReturnValue({
        select: jest.fn().mockRejectedValue(error),
      });

      await userController.getUserByEmail(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('createUser', () => {
    test('devrait créer un utilisateur avec succès', async () => {
      const userData = {
        nom: 'Test',
        prenom: 'User',
        email: 'test@test.com',
        password: 'password123',
        niveau: 'lycée',
        classe: '1ère',
      };
      req.body = userData;

      User.findOne = jest.fn().mockResolvedValue(null);
      User.prototype.save = jest.fn().mockResolvedValue(userData);
      User.mockImplementation(() => ({
        save: User.prototype.save,
      }));

      await userController.createUser(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });

    test('devrait retourner une erreur si utilisateur existe déjà', async () => {
      const userData = { email: 'test@test.com' };
      req.body = userData;

      User.findOne = jest.fn().mockResolvedValue({ email: 'test@test.com' });

      await userController.createUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Cet utilisateur existe déjà.' });
    });

    test('devrait gérer les erreurs de création', async () => {
      const error = new Error('Erreur de sauvegarde');
      req.body = { email: 'test@test.com' };

      User.findOne = jest.fn().mockResolvedValue(null);
      User.prototype.save = jest.fn().mockRejectedValue(error);
      User.mockImplementation(() => ({
        save: User.prototype.save,
      }));

      await userController.createUser(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getUserById', () => {
    test('devrait retourner un utilisateur par ID', async () => {
      const mockUser = { _id: '123', email: 'test@test.com' };
      req.params.id = '123';

      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      await userController.getUserById(req, res, next);

      expect(User.findById).toHaveBeenCalledWith('123');
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    test('devrait retourner 404 si utilisateur non trouvé', async () => {
      req.params.id = '123';

      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await userController.getUserById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Utilisateur non trouvé.' });
    });

    test('devrait gérer les erreurs', async () => {
      const error = new Error('Erreur base de données');
      req.params.id = '123';

      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockRejectedValue(error),
      });

      await userController.getUserById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('updateUser', () => {
    test('devrait mettre à jour un utilisateur', async () => {
      const updatedUser = { _id: '123', nom: 'Updated' };
      req.params.id = '123';
      req.body = { nom: 'Updated' };

      User.findByIdAndUpdate = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(updatedUser),
      });

      await userController.updateUser(req, res, next);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        { nom: 'Updated' },
        {
          new: true,
          runValidators: true,
        }
      );
      expect(res.json).toHaveBeenCalledWith(updatedUser);
    });

    test('devrait retourner 404 si utilisateur non trouvé', async () => {
      req.params.id = '123';
      req.body = { nom: 'Updated' };

      User.findByIdAndUpdate = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await userController.updateUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Utilisateur non trouvé.' });
    });

    test('devrait gérer les erreurs', async () => {
      const error = new Error('Erreur mise à jour');
      req.params.id = '123';
      req.body = { nom: 'Updated' };

      User.findByIdAndUpdate = jest.fn().mockReturnValue({
        select: jest.fn().mockRejectedValue(error),
      });

      await userController.updateUser(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteUser', () => {
    test('devrait supprimer un utilisateur', async () => {
      const deletedUser = { _id: '123' };
      req.params.id = '123';

      User.findByIdAndDelete = jest.fn().mockResolvedValue(deletedUser);

      await userController.deleteUser(req, res, next);

      expect(User.findByIdAndDelete).toHaveBeenCalledWith('123');
      expect(res.json).toHaveBeenCalledWith({ message: 'Utilisateur supprimé avec succès.' });
    });

    test('devrait retourner 404 si utilisateur non trouvé', async () => {
      req.params.id = '123';

      User.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      await userController.deleteUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Utilisateur non trouvé.' });
    });

    test('devrait gérer les erreurs', async () => {
      const error = new Error('Erreur suppression');
      req.params.id = '123';

      User.findByIdAndDelete = jest.fn().mockRejectedValue(error);

      await userController.deleteUser(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('updateTokens', () => {
    test('devrait ajouter des jetons', async () => {
      const mockUser = { _id: '123', jetons: 10, save: jest.fn().mockResolvedValue() };
      req.params.id = '123';
      req.body = { jetons: 5, operation: 'add' };

      User.findById = jest.fn().mockResolvedValue(mockUser);

      await userController.updateTokens(req, res, next);

      expect(mockUser.jetons).toBe(15);
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ jetons: 15 });
    });

    test('devrait soustraire des jetons', async () => {
      const mockUser = { _id: '123', jetons: 10, save: jest.fn().mockResolvedValue() };
      req.params.id = '123';
      req.body = { jetons: 3, operation: 'subtract' };

      User.findById = jest.fn().mockResolvedValue(mockUser);

      await userController.updateTokens(req, res, next);

      expect(mockUser.jetons).toBe(7);
      expect(res.json).toHaveBeenCalledWith({ jetons: 7 });
    });

    test('devrait retourner erreur si jetons insuffisants', async () => {
      const mockUser = { _id: '123', jetons: 2 };
      req.params.id = '123';
      req.body = { jetons: 5, operation: 'subtract' };

      User.findById = jest.fn().mockResolvedValue(mockUser);

      await userController.updateTokens(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Jetons insuffisants.' });
    });

    test('devrait définir le nombre de jetons', async () => {
      const mockUser = { _id: '123', jetons: 10, save: jest.fn().mockResolvedValue() };
      req.params.id = '123';
      req.body = { jetons: 20, operation: 'set' };

      User.findById = jest.fn().mockResolvedValue(mockUser);

      await userController.updateTokens(req, res, next);

      expect(mockUser.jetons).toBe(20);
      expect(res.json).toHaveBeenCalledWith({ jetons: 20 });
    });

    test('devrait retourner erreur pour opération invalide', async () => {
      const mockUser = { _id: '123', jetons: 10 };
      req.params.id = '123';
      req.body = { jetons: 5, operation: 'invalid' };

      User.findById = jest.fn().mockResolvedValue(mockUser);

      await userController.updateTokens(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Opération invalide.' });
    });

    test('devrait retourner erreur si utilisateur non trouvé', async () => {
      req.params.id = '123';
      req.body = { jetons: 5, operation: 'add' };

      User.findById = jest.fn().mockResolvedValue(null);

      await userController.updateTokens(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Utilisateur non trouvé.' });
    });

    test("devrait retourner erreur si jetons n'est pas un nombre", async () => {
      const mockUser = { _id: '123', jetons: 10 };
      req.params.id = '123';
      req.body = { jetons: 'invalid', operation: 'add' };

      User.findById = jest.fn().mockResolvedValue(mockUser);

      await userController.updateTokens(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Le nombre de jetons doit être un nombre.' });
    });

    test('devrait gérer les erreurs', async () => {
      const error = new Error('Erreur base de données');
      req.params.id = '123';
      req.body = { jetons: 5, operation: 'add' };

      User.findById = jest.fn().mockRejectedValue(error);

      await userController.updateTokens(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('verifyPassword', () => {
    test('devrait vérifier un mot de passe correct', async () => {
      const mockUser = {
        _id: '123',
        comparePassword: jest.fn().mockResolvedValue(true),
      };
      req.params.id = '123';
      req.body = { password: 'correctPassword' };

      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      await userController.verifyPassword(req, res, next);

      expect(mockUser.comparePassword).toHaveBeenCalledWith('correctPassword');
      expect(res.json).toHaveBeenCalledWith({ valid: true });
    });

    test('devrait vérifier un mot de passe incorrect', async () => {
      const mockUser = {
        _id: '123',
        comparePassword: jest.fn().mockResolvedValue(false),
      };
      req.params.id = '123';
      req.body = { password: 'wrongPassword' };

      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      await userController.verifyPassword(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ valid: false });
    });

    test('devrait retourner erreur si utilisateur non trouvé', async () => {
      req.params.id = '123';
      req.body = { password: 'password' };

      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await userController.verifyPassword(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ valid: false, error: 'Utilisateur non trouvé.' });
    });

    test('devrait gérer les erreurs', async () => {
      const error = new Error('Erreur base de données');
      req.params.id = '123';
      req.body = { password: 'password' };

      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockRejectedValue(error),
      });

      await userController.verifyPassword(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
