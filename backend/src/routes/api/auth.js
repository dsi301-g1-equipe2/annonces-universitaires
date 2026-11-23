const router = require('express').Router();
const c = require('../../controllers/api/authController');
const { uploadCarte } = require('../../middlewares/upload');
const { exiger } = require('../../middlewares/validation');

router.post('/register', uploadCarte, exiger('nom', 'prenom', 'emailInstitutionnel', 'motDePasse'), c.register);

router.post('/login', c.login);

module.exports = router;