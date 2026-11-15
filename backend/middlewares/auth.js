const mongoose = require('mongoose');
const { Etudiant, Agent } = require('../models');

async function fakeAuth(req, res, next) {
  const id = req.header('x-user-id');
  if (!id || !mongoose.isValidObjectId(id)) {
    return res.status(401).json({ erreur: 'Utilisateur non identifié' });
  }
  try {
    let user = await Etudiant.findById(id);
    let role = 'etudiant';
    if (!user) {
      user = await Agent.findById(id);
      role = 'agent';
    }
    if (!user) return res.status(401).json({ erreur: 'Utilisateur inconnu' });
    req.user = user;
    req.role = role;
    next();
  } catch (err) {
    next(err);
  }
}

const requireRole = (...roles) => (req, res, next) => {
  if (!req.role || !roles.includes(req.role)) {
    return res.status(403).json({ erreur: 'Accès interdit' });
  }
  next();
};

module.exports = { fakeAuth, requireRole };