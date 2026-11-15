const router = require('express').Router();
const { fakeAuth, requireRole } = require('../middlewares/auth');

// Exemple : to be deleted 
router.get('/ping-etudiant', fakeAuth, requireRole('etudiant'), (req, res) => {
  res.json({ message: `Bonjour ${req.user.prenom}` });
});

module.exports = router;