const Quiz = require('../models/Quiz');

// Créer un quiz
exports.createQuiz = async (req, res, next) => {
  try {
    const quiz = new Quiz(req.body);
    const savedQuiz = await quiz.save();
    res.status(201).json(savedQuiz);
  } catch (error) {
    next(error);
  }
};

// Récupérer un quiz par ID
exports.getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz non trouvé.' });
    res.json(quiz);
  } catch (error) {
    next(error);
  }
};

// Récupérer tous les quiz d'un utilisateur
exports.getQuizzesByUser = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({ user_id: req.params.userId }).sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    next(error);
  }
};

// Récupérer tous les quiz d'une matière pour un utilisateur
exports.getQuizzesBySubject = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({ user_id: req.params.userId, subject: req.params.subject }).sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    next(error);
  }
};

// Supprimer un quiz
exports.deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz non trouvé.' });
    res.json({ message: 'Quiz supprimé avec succès.' });
  } catch (error) {
    next(error);
  }
}; 