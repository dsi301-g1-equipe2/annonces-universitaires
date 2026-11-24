const router = require('express').Router();
const c = require('../../controllers/web/agentController');
const moderationController = require('../../controllers/web/moderationController');

router.get('/', c.accueil);
router.get('/announcements/pending',moderationController.afficherAnnoncesEnAttente);
router.get('/announcements/:id',moderationController.afficherDetailAnnonce);
router.post('/announcements/:id/validate',moderationController.validerAnnonce);
router.post('/announcements/:id/reject',moderationController.refuserAnnonce);

module.exports = router;