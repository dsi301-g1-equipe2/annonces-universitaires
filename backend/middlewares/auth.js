const mongoose = require('mongoose');
const { User } = require('../models');

async function fakeAuth(req, res, next) {
  const id = req.header('x-user-id');
  if (!id || !mongoose.isValidObjectId(id)) {
    return res.status(401).json({ erreur: 'Utilisateur non identifié' });
  }
  try {
    const user = await User.findById(id);
    if (!user) return res.status(401).json({ erreur: 'Utilisateur inconnu' });
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ erreur: 'Accès interdit' });
  }
  next();
};

module.exports = { fakeAuth, requireRole };