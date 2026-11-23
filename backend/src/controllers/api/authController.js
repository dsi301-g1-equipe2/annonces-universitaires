const etudiantService = require('../../services/etudiantService');

const login = async (req, res) => {
  const { email, motDePasse } = req.body ?? {};
  res.json(await etudiantService.login(email, motDePasse));
};

module.exports = { login };