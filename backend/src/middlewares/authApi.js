const { verifierToken } = require('../util/token');
const etudiantService = require('../services/etudiantService');
const erreur = require('../util/erreur');

module.exports = async (req, res, next) => {
  try {
    const [type, token] = (req.headers.authorization || '').split(' ');
    if (type !== 'Bearer' || !token) throw erreur('Authentification requise', 401);

    let payload;
    try {
      payload = verifierToken(token);
    } catch {
      throw erreur('Session invalide ou expirée', 401);
    }
    if (payload.role !== 'etudiant') throw erreur('Accès refusé', 403);

    const etudiant = await etudiantService.trouverParId(payload.id);
    if (!etudiant || etudiant.statut !== 'ACTIF') throw erreur('Session invalide', 401);

    req.user = etudiant; 
    next();
  } catch (err) {
    next(err);
  }
};