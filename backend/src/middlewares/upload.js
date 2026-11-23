const multer = require('multer');
const erreur = require('../util/erreur');

function upload(champ, { types, tailleMaxMo, max = 1 }) {
  const formats = types.map((t) => t.split('/')[1].toUpperCase()).join(', ');

  const multerConfig = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: tailleMaxMo * 1024 * 1024, files: max },
    fileFilter: (req, file, cb) => {
      if (types.includes(file.mimetype)) return cb(null, true);
      cb(erreur(`Format non autorisé (accepté : ${formats})`, 400));
    },
  });

  const lire = max === 1 ? multerConfig.single(champ) : multerConfig.array(champ, max);

  return (req, res, next) => {
    lire(req, res, (err) => {
      if (!err) return next();
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(erreur(`Fichier trop volumineux (maximum ${tailleMaxMo} Mo)`, 400));
      }
      if (err.code === 'LIMIT_FILE_COUNT' || err.code === 'LIMIT_UNEXPECTED_FILE') {
        return next(erreur(`Envoyez au maximum ${max} fichier(s) dans le champ "${champ}"`, 400));
      }
      next(err);
    });
  };
}

const uploadCarte = upload('carteEtudiant', { types: ['image/jpeg', 'image/png'], tailleMaxMo: 2 });

module.exports = { upload, uploadCarte };