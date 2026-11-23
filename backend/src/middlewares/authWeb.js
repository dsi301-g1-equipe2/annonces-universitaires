const { lireCookie, effacerCookie } = require('../util/cookie');
const { verifierToken } = require('../util/token');
const agentService = require('../services/agentService');

module.exports = async (req, res, next) => {
  try {
    const token = lireCookie(req);
    if (!token) return res.redirect('/agent/login');

    const payload = verifierToken(token);
    if (payload.role !== 'agent') throw new Error('rôle refusé');

    const agent = await agentService.trouverParId(payload.id);
    if (!agent) throw new Error('agent introuvable');

    req.agent = agent.toPublic();
    res.locals.agent = req.agent;
    next();
  } catch (err) {
    effacerCookie(res);
    res.redirect('/agent/login');
  }
};