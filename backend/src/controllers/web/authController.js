const agentService = require('../../services/agentService');
const { poserCookie, effacerCookie } = require('../../util/cookie');

const afficherLogin = (req, res) => {
  res.render('layout', { page: 'pages/login', titre: 'Connexion agent', erreur: null, email: '' });
};

const login = async (req, res) => {
  const { email, motDePasse } = req.body ?? {};
  try {
    const { token } = await agentService.login(email, motDePasse);
    poserCookie(res, token);
    res.redirect('/agent');
  } catch (err) {
    if (!err.status) console.error(err);
    res.status(err.status || 500).render('layout', {
      page: 'pages/login',
      titre: 'Connexion agent',
      erreur: err.status ? err.message : 'Erreur serveur',
      email: email || '',
    });
  }
};

const logout = (req, res) => {
  effacerCookie(res);
  res.redirect('/agent/login');
};

module.exports = { afficherLogin, login, logout };