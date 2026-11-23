const router = require('express').Router();
const c = require('../../controllers/api/authController');

router.post('/login', c.login);

module.exports = router;