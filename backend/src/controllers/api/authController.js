const etudiantService = require('../../services/etudiantService');

const register = async (req, res) => {
  const etudiant = await etudiantService.register(req.body, req.file);
  res.status(201).json({ message: 'Inscription envoyée, en attente de validation par un agent', etudiant });
};

const login = async (req, res) => {
  const { email, motDePasse } = req.body ?? {};
  res.json(await etudiantService.login(email, motDePasse));
};

module.exports = { register, login };