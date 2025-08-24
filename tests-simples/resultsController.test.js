const mongoose = require('mongoose');

// Mock du modèle Results
jest.mock('../src/models/Results');
const Results = require('../src/models/Results');

// Import du controller
const resultsController = require('../src/controllers/resultsController');

describe('ResultsController - Tests Complets', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    
    // Reset des mocks
    jest.clearAllMocks();
  });

  describe('createResult', () => {
    test('devrait créer un résultat', async () => {
      const resultData = { user_id: 'user123', quiz_id: 'quiz123', score: 85 };
      const savedResult = { _id: '123', ...resultData };
      req.body = resultData;

      Results.prototype.save = jest.fn().mockResolvedValue(savedResult);
      Results.mockImplementation(() => ({
        save: Results.prototype.save
      }));

      await resultsController.createResult(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(savedResult);
    });

    test('devrait gérer les erreurs de création', async () => {
      const error = new Error('Erreur de sauvegarde');
      req.body = { user_id: 'user123' };

      Results.prototype.save = jest.fn().mockRejectedValue(error);
      Results.mockImplementation(() => ({
        save: Results.prototype.save
      }));

      await resultsController.createResult(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getMoyenneParMatiere', () => {
    beforeEach(() => {
      // Mock mongoose.Types.ObjectId
      mongoose.Types = {
        ObjectId: jest.fn().mockImplementation((id) => id)
      };
    });

    test('devrait calculer la moyenne par matière avec req.user.id', async () => {
      const mockMoyennes = [{ _id: 'math', moyenne: 85 }, { _id: 'français', moyenne: 78 }];
      req.user = { id: 'user123' };

      Results.aggregate = jest.fn().mockResolvedValue(mockMoyennes);

      await resultsController.getMoyenneParMatiere(req, res, next);

      expect(Results.aggregate).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockMoyennes);
    });

    test('devrait calculer la moyenne par matière avec req.user._id', async () => {
      const mockMoyennes = [{ _id: 'math', moyenne: 85 }];
      req.user = { _id: 'user123' };

      Results.aggregate = jest.fn().mockResolvedValue(mockMoyennes);

      await resultsController.getMoyenneParMatiere(req, res, next);

      expect(Results.aggregate).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockMoyennes);
    });

    test('devrait calculer la moyenne par matière avec req.params.userId', async () => {
      const mockMoyennes = [{ _id: 'math', moyenne: 85 }];
      req.params = { userId: 'user123' };

      Results.aggregate = jest.fn().mockResolvedValue(mockMoyennes);

      await resultsController.getMoyenneParMatiere(req, res, next);

      expect(Results.aggregate).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockMoyennes);
    });

    test('devrait gérer les erreurs', async () => {
      const error = new Error('Erreur agrégation');
      req.user = { id: 'user123' };

      Results.aggregate = jest.fn().mockRejectedValue(error);

      await resultsController.getMoyenneParMatiere(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    test('devrait gérer un ObjectId string', async () => {
      const mockMoyennes = [{ _id: 'math', moyenne: 85 }];
      req.user = { id: 'user123' };

      Results.aggregate = jest.fn().mockResolvedValue(mockMoyennes);

      await resultsController.getMoyenneParMatiere(req, res, next);

      expect(mongoose.Types.ObjectId).toHaveBeenCalledWith('user123');
      expect(res.json).toHaveBeenCalledWith(mockMoyennes);
    });

    test('devrait gérer un ObjectId déjà existant', async () => {
      const mockMoyennes = [{ _id: 'math', moyenne: 85 }];
      const objectId = { toString: () => 'user123' };
      req.user = { id: objectId };

      Results.aggregate = jest.fn().mockResolvedValue(mockMoyennes);

      await resultsController.getMoyenneParMatiere(req, res, next);

      expect(Results.aggregate).toHaveBeenCalledWith([
        { $match: { user_id: objectId } },
        { $group: { _id: '$matiere', moyenne: { $avg: '$note' } } }
      ]);
      expect(res.json).toHaveBeenCalledWith(mockMoyennes);
    });
  });

  describe('getResultsByUser', () => {
    test('devrait retourner les résultats d\'un utilisateur avec req.user.userId', async () => {
      const mockResults = [{ _id: '1', score: 85 }, { _id: '2', score: 92 }];
      req.user = { userId: 'user123' };

      Results.find = jest.fn().mockResolvedValue(mockResults);

      await resultsController.getResultsByUser(req, res, next);

      expect(Results.find).toHaveBeenCalledWith({ user_id: 'user123' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResults);
    });

    test('devrait retourner les résultats d\'un utilisateur avec req.user.id', async () => {
      const mockResults = [{ _id: '1', score: 85 }];
      req.user = { id: 'user123' };

      Results.find = jest.fn().mockResolvedValue(mockResults);

      await resultsController.getResultsByUser(req, res, next);

      expect(Results.find).toHaveBeenCalledWith({ user_id: 'user123' });
      expect(res.json).toHaveBeenCalledWith(mockResults);
    });

    test('devrait retourner les résultats d\'un utilisateur avec req.user._id', async () => {
      const mockResults = [{ _id: '1', score: 85 }];
      req.user = { _id: 'user123' };

      Results.find = jest.fn().mockResolvedValue(mockResults);

      await resultsController.getResultsByUser(req, res, next);

      expect(Results.find).toHaveBeenCalledWith({ user_id: 'user123' });
      expect(res.json).toHaveBeenCalledWith(mockResults);
    });

    test('devrait retourner les résultats d\'un utilisateur avec req.params.userId', async () => {
      const mockResults = [{ _id: '1', score: 85 }];
      req.params = { userId: 'user123' };

      Results.find = jest.fn().mockResolvedValue(mockResults);

      await resultsController.getResultsByUser(req, res, next);

      expect(Results.find).toHaveBeenCalledWith({ user_id: 'user123' });
      expect(res.json).toHaveBeenCalledWith(mockResults);
    });

    test('devrait gérer les erreurs', async () => {
      const error = new Error('Erreur base de données');
      req.user = { id: 'user123' };

      Results.find = jest.fn().mockRejectedValue(error);

      await resultsController.getResultsByUser(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    test('devrait gérer le cas où aucun userId n\'est fourni', async () => {
      const mockResults = [];
      req.user = {};
      req.params = {};

      Results.find = jest.fn().mockResolvedValue(mockResults);

      await resultsController.getResultsByUser(req, res, next);

      expect(Results.find).toHaveBeenCalledWith({ user_id: undefined });
      expect(res.json).toHaveBeenCalledWith(mockResults);
    });
  });
});
