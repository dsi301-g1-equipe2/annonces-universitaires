const router = require('express').Router();
const { fakeAuth, requireRole } = require('../middlewares/auth');

// Étudiants
router.use('/api/categories', fakeAuth, requireRole('etudiant'), require('./api/categories'));
router.use('/api/announcements', fakeAuth, requireRole('etudiant'), require('./api/feed'));
router.use('/api/announcements', fakeAuth, requireRole('etudiant'), require('./api/announcements'));
router.use('/api/announcements', fakeAuth, requireRole('etudiant'), require('./api/medias'));

// Agents
router.use('/agent/categories', fakeAuth, requireRole('agent'), require('./agent/categories'));
router.use('/agent/announcements', fakeAuth, requireRole('agent'), require('./agent/moderation'));

module.exports = router;