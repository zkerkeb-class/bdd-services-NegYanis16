const mongoose = require('mongoose');
const Results = require('../models/Results');

// Créer un résultat
exports.createResult = async (req, res, next) => {
  try {
    const result = new Results(req.body);
    const saved = await result.save();
    res.status(201).json(saved);
  } catch (error) {
    next(error);
  }
};

// Récupérer la moyenne des notes pour chaque matière de l'utilisateur connecté
exports.getMoyenneParMatiere = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id || req.params.userId;
    const objectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
    const moyennes = await Results.aggregate([
      { $match: { user_id: objectId } },
      { $group: { _id: '$matiere', moyenne: { $avg: '$note' } } },
    ]);
    res.json(moyennes);
  } catch (error) {
    next(error);
  }
};

// Récupérer tous les résultats d'un utilisateur
exports.getResultsByUser = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id || req.user?._id || req.params.userId;
    const results = await Results.find({ user_id: userId });
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};
