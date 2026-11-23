const router = require('express').Router();
const authApi = require('../../middlewares/authApi');

router.get('/', authApi, (req, res) => res.json({ etudiant: req.user.toPublic() }));

module.exports = router;