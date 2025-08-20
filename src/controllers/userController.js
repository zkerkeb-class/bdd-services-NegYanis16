const User = require('../models/User');

// Vérifier si un utilisateur existe par email
exports.getUserByEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('-password');
    return res.json(user);
  } catch (error) {
    return next(error);
  }
};

// Créer un utilisateur (local ou Google)
exports.createUser = async (req, res, next) => {
  try {
    const { nom, prenom, email, password, niveau, classe, authProvider, googleId, avatar } =
      req.body;
    // Vérifier si l'utilisateur existe déjà
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Cet utilisateur existe déjà.' });
    }
    const user = new User({
      nom,
      prenom,
      email,
      password,
      niveau,
      classe,
      authProvider,
      googleId,
      avatar,
    });
    await user.save();
    return res.status(201).json(user);
  } catch (error) {
    return next(error);
  }
};

// Récupérer un utilisateur par ID
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    return res.json(user);
  } catch (error) {
    return next(error);
  }
};

// Mettre à jour un utilisateur
exports.updateUser = async (req, res, next) => {
  try {
    const updates = req.body;
    // Si mot de passe fourni, il sera hashé par le modèle
    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    return res.json(user);
  } catch (error) {
    return next(error);
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    return res.json({ message: 'Utilisateur supprimé avec succès.' });
  } catch (error) {
    return next(error);
  }
};

// Mettre à jour les jetons
exports.updateTokens = async (req, res, next) => {
  try {
    const { jetons, operation } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    if (typeof jetons !== 'number')
      return res.status(400).json({ error: 'Le nombre de jetons doit être un nombre.' });
    switch (operation) {
      case 'add':
        user.jetons = (user.jetons || 0) + jetons;
        break;
      case 'subtract':
        if ((user.jetons || 0) < jetons)
          return res.status(400).json({ error: 'Jetons insuffisants.' });
        user.jetons -= jetons;
        break;
      case 'set':
        user.jetons = jetons;
        break;
      default:
        return res.status(400).json({ error: 'Opération invalide.' });
    }
    await user.save();
    return res.json({ jetons: user.jetons });
  } catch (error) {
    return next(error);
  }
};

// Vérifier le mot de passe d'un utilisateur
exports.verifyPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.params.id).select('+password');
    if (!user) return res.status(404).json({ valid: false, error: 'Utilisateur non trouvé.' });
    const isMatch = await user.comparePassword(password);
    return res.json({ valid: isMatch });
  } catch (error) {
    return next(error);
  }
};
