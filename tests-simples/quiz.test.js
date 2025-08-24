const mongoose = require('mongoose');

// Mock de la connexion MongoDB
mongoose.connect = jest.fn();
mongoose.connection = {
  close: jest.fn(),
};

// Import du modèle Quiz
const Quiz = require('../src/models/Quiz');

describe('Modèle Quiz - Tests Simples', () => {
  describe('Validation des données', () => {
    test('devrait valider un quiz avec des données correctes', () => {
      const quizData = {
        level: 'Terminale',
        subject: 'Mathématiques',
        questions: [
          {
            question: 'Quelle est la dérivée de x² ?',
            type: 'QCM',
            options: ['x', '2x', 'x²', '2x²'],
            correctAnswer: '2x',
            weight: 1,
          },
        ],
      };

      const quiz = new Quiz(quizData);

      expect(quiz.level).toBe('Terminale');
      expect(quiz.subject).toBe('Mathématiques');
      expect(quiz.questions).toHaveLength(1);
      expect(quiz.questions[0].question).toBe('Quelle est la dérivée de x² ?');
    });

    test('devrait valider une question QCM', () => {
      const quizData = {
        level: 'Terminale',
        subject: 'Mathématiques',
        questions: [
          {
            question: 'Question QCM',
            type: 'QCM',
            options: ['A', 'B', 'C', 'D'],
            correctAnswer: 'B',
            weight: 2,
          },
        ],
      };

      const quiz = new Quiz(quizData);
      expect(quiz.questions[0].type).toBe('QCM');
      expect(quiz.questions[0].options).toHaveLength(4);
    });

    test('devrait valider une question ouverte', () => {
      const quizData = {
        level: 'Terminale',
        subject: 'Mathématiques',
        questions: [
          {
            question: 'Question ouverte',
            type: 'open',
            correctAnswer: 'Réponse libre',
            weight: 1,
          },
        ],
      };

      const quiz = new Quiz(quizData);
      expect(quiz.questions[0].type).toBe('open');
      // Pour les questions ouvertes, options peut être undefined, null ou un tableau vide
      // Un tableau vide est truthy en JavaScript, donc on vérifie juste qu'il n'a pas d'options valides
      expect(quiz.questions[0].options).toBeDefined();
      expect(Array.isArray(quiz.questions[0].options)).toBe(true);
      expect(quiz.questions[0].options.length).toBe(0);
    });
  });

  describe('Structure du schéma', () => {
    test('devrait avoir les bonnes propriétés dans le schéma', () => {
      const quizSchema = Quiz.schema;

      expect(quizSchema.paths.level).toBeDefined();
      expect(quizSchema.paths.subject).toBeDefined();
      expect(quizSchema.paths.questions).toBeDefined();
      expect(quizSchema.paths.user_id).toBeDefined();
    });
  });
});
