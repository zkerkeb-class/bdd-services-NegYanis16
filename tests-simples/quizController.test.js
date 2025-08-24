// Mock du modèle Quiz
jest.mock('../src/models/Quiz');
const Quiz = require('../src/models/Quiz');

// Import du controller
const quizController = require('../src/controllers/quizController');

describe('QuizController - Tests Complets', () => {
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

  describe('createQuiz', () => {
    test('devrait créer un quiz avec succès', async () => {
      const quizData = { title: 'Test Quiz', questions: [] };
      const savedQuiz = { _id: '123', ...quizData };
      req.body = quizData;

      Quiz.prototype.save = jest.fn().mockResolvedValue(savedQuiz);
      Quiz.mockImplementation(() => ({
        save: Quiz.prototype.save,
      }));

      await quizController.createQuiz(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(savedQuiz);
    });

    test('devrait gérer les erreurs de création', async () => {
      const error = new Error('Erreur de sauvegarde');
      req.body = { title: 'Test Quiz' };

      Quiz.prototype.save = jest.fn().mockRejectedValue(error);
      Quiz.mockImplementation(() => ({
        save: Quiz.prototype.save,
      }));

      await quizController.createQuiz(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getQuizById', () => {
    test('devrait retourner un quiz par ID', async () => {
      const mockQuiz = { _id: '123', title: 'Test Quiz' };
      req.params.id = '123';

      Quiz.findById = jest.fn().mockResolvedValue(mockQuiz);

      await quizController.getQuizById(req, res, next);

      expect(Quiz.findById).toHaveBeenCalledWith('123');
      expect(res.json).toHaveBeenCalledWith(mockQuiz);
    });

    test('devrait retourner 404 si quiz non trouvé', async () => {
      req.params.id = '123';

      Quiz.findById = jest.fn().mockResolvedValue(null);

      await quizController.getQuizById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Quiz non trouvé.' });
    });

    test('devrait gérer les erreurs', async () => {
      const error = new Error('Erreur base de données');
      req.params.id = '123';

      Quiz.findById = jest.fn().mockRejectedValue(error);

      await quizController.getQuizById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getQuizzesByUser', () => {
    test("devrait retourner les quiz d'un utilisateur", async () => {
      const mockQuizzes = [
        { _id: '1', title: 'Quiz 1' },
        { _id: '2', title: 'Quiz 2' },
      ];
      req.params.userId = 'user123';

      Quiz.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockQuizzes),
      });

      await quizController.getQuizzesByUser(req, res, next);

      expect(Quiz.find).toHaveBeenCalledWith({ user_id: 'user123' });
      expect(res.json).toHaveBeenCalledWith(mockQuizzes);
    });

    test('devrait gérer les erreurs', async () => {
      const error = new Error('Erreur base de données');
      req.params.userId = 'user123';

      Quiz.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockRejectedValue(error),
      });

      await quizController.getQuizzesByUser(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getQuizzesBySubject', () => {
    test('devrait retourner les quiz par matière', async () => {
      const mockQuizzes = [{ _id: '1', subject: 'math' }];
      req.params.userId = 'user123';
      req.params.subject = 'math';

      Quiz.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockQuizzes),
      });

      await quizController.getQuizzesBySubject(req, res, next);

      expect(Quiz.find).toHaveBeenCalledWith({
        user_id: 'user123',
        subject: 'math',
      });
      expect(res.json).toHaveBeenCalledWith(mockQuizzes);
    });

    test('devrait gérer les erreurs', async () => {
      const error = new Error('Erreur base de données');
      req.params.userId = 'user123';
      req.params.subject = 'math';

      Quiz.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockRejectedValue(error),
      });

      await quizController.getQuizzesBySubject(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteQuiz', () => {
    test('devrait supprimer un quiz', async () => {
      const deletedQuiz = { _id: '123' };
      req.params.id = '123';

      Quiz.findByIdAndDelete = jest.fn().mockResolvedValue(deletedQuiz);

      await quizController.deleteQuiz(req, res, next);

      expect(Quiz.findByIdAndDelete).toHaveBeenCalledWith('123');
      expect(res.json).toHaveBeenCalledWith({ message: 'Quiz supprimé avec succès.' });
    });

    test('devrait retourner 404 si quiz non trouvé', async () => {
      req.params.id = '123';

      Quiz.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      await quizController.deleteQuiz(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Quiz non trouvé.' });
    });

    test('devrait gérer les erreurs', async () => {
      const error = new Error('Erreur suppression');
      req.params.id = '123';

      Quiz.findByIdAndDelete = jest.fn().mockRejectedValue(error);

      await quizController.deleteQuiz(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
