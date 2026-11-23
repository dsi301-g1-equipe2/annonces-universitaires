const router = require('express').Router();

router.get('/ping', (req, res) => res.json({ ok: true }));
router.use('/auth', require('./auth'));
router.use('/me', require('./me'));

module.exports = router;