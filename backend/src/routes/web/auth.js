const router = require('express').Router();
const c = require('../../controllers/web/authController');

router.get('/agent/login', c.afficherLogin);
router.post('/agent/login', c.login);
router.post('/agent/logout', c.logout);

module.exports = router;