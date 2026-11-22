const erreur = require('../util/erreur');

// Utilisation : router.post('/register', exiger('nom', 'prenom', 'emailInstitutionnel'), controller.register)
const exiger = (...champs) => (req, res, next) => {
  const manquants = champs.filter(
    (c) => req.body[c] === undefined || String(req.body[c]).trim() === ''
  );
  if (manquants.length) {
    return next(erreur(`Champs obligatoires manquants : ${manquants.join(', ')}`, 400));
  }
  next();
};

module.exports = { exiger };