const router = require('express').Router();
const authWeb = require('../../middlewares/authWeb');

router.get('/', (req, res) => {
    res.redirect('/agent/login');
});

router.use(require('./auth'));
router.use('/agent', authWeb, require('./agent'));

module.exports = router;