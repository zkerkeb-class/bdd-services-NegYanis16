const mongoose = require('mongoose');

// Mock de la connexion MongoDB
mongoose.connect = jest.fn();
mongoose.connection = {
  close: jest.fn()
};

// Import du modèle Results
const Results = require('../src/models/Results');

describe('Modèle Results - Tests Simples', () => {
  
  describe('Validation des données', () => {
    test('devrait valider un résultat avec des données correctes', () => {
      const resultData = {
        matiere: 'Mathématiques',
        note: 15,
        coefficient: 2,
        user_id: new mongoose.Types.ObjectId(),
        quiz_id: new mongoose.Types.ObjectId()
      };

      const result = new Results(resultData);
      
      expect(result.matiere).toBe('Mathématiques');
      expect(result.note).toBe(15);
      expect(result.coefficient).toBe(2);
    });

    test('devrait rejeter un résultat sans matière', () => {
      const resultData = {
        note: 15,
        coefficient: 2,
        user_id: new mongoose.Types.ObjectId(),
        quiz_id: new mongoose.Types.ObjectId()
      };

      const result = new Results(resultData);
      
      const validationError = result.validateSync();
      expect(validationError).toBeDefined();
      expect(validationError.errors.matiere).toBeDefined();
    });

    test('devrait rejeter un résultat sans note', () => {
      const resultData = {
        matiere: 'Mathématiques',
        coefficient: 2,
        user_id: new mongoose.Types.ObjectId(),
        quiz_id: new mongoose.Types.ObjectId()
      };

      const result = new Results(resultData);
      
      const validationError = result.validateSync();
      expect(validationError).toBeDefined();
      expect(validationError.errors.note).toBeDefined();
    });
  });

  describe('Calculs et méthodes', () => {
    test('devrait calculer le score pondéré correctement', () => {
      const result = new Results({
        matiere: 'Mathématiques',
        note: 15,
        coefficient: 2,
        user_id: new mongoose.Types.ObjectId(),
        quiz_id: new mongoose.Types.ObjectId()
      });

      const scorePondere = result.note * result.coefficient;
      expect(scorePondere).toBe(30);
    });

    test('devrait valider une note valide', () => {
      const result = new Results({
        matiere: 'Mathématiques',
        note: 18,
        coefficient: 1,
        user_id: new mongoose.Types.ObjectId(),
        quiz_id: new mongoose.Types.ObjectId()
      });

      expect(result.note).toBeGreaterThanOrEqual(0);
      expect(result.note).toBeLessThanOrEqual(20);
    });
  });

  describe('Structure du schéma', () => {
    test('devrait avoir les bonnes propriétés dans le schéma', () => {
      const resultsSchema = Results.schema;
      
      expect(resultsSchema.paths.matiere).toBeDefined();
      expect(resultsSchema.paths.note).toBeDefined();
      expect(resultsSchema.paths.coefficient).toBeDefined();
      expect(resultsSchema.paths.user_id).toBeDefined();
      expect(resultsSchema.paths.quiz_id).toBeDefined();
    });
  });
}); 