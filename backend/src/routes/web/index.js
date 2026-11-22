const router = require('express').Router();

router.get('/', (req, res) => res.send('Backend annonces OK'));

module.exports = router;