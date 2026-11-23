const router = require('express').Router();
const c = require('../../controllers/web/agentController');

router.get('/', c.accueil);

module.exports = router;