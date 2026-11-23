const agentRepository = require('../repositories/agentRepository');
const { creerToken } = require('../util/token');
const erreur = require('../util/erreur');

async function login(email, motDePasse) {
  if (!email || !motDePasse) {
    throw erreur('Email et mot de passe obligatoires', 400);
  }
  const agent = await agentRepository.trouverParEmail(email);
  if (!agent || !(await agent.checkPassword(motDePasse))) {
    throw erreur('Email ou mot de passe incorrect', 401);
  }
  const token = creerToken({ id: agent._id.toString(), role: 'agent' });
  return { token, agent: agent.toPublic() };
}

const trouverParId = (id) => agentRepository.trouverParId(id);

module.exports = { login, trouverParId };