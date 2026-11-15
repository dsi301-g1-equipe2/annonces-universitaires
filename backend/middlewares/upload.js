const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Dossier où les fichiers sont enregistrés (à ignorer dans Git)
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'medias');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Formats autorisés -> type attendu par le modèle Announcement (PHOTO / VIDEO)
const TYPES = { 'image/jpeg': 'PHOTO', 'image/png': 'PHOTO', 'video/mp4': 'VIDEO' };
const EXTENSIONS = { 'image/jpeg': '.jpg', 'image/png': '.png', 'video/mp4': '.mp4' };
const TAILLE_MAX_MO = 20;
const NB_MAX_FICHIERS = 5;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  // Nom aléatoire : on ne garde jamais le nom envoyé par l'utilisateur
  filename: (req, file, cb) => cb(null, crypto.randomUUID() + EXTENSIONS[file.mimetype]),
});

function fileFilter(req, file, cb) {
  if (TYPES[file.mimetype]) return cb(null, true);
  const err = new Error('Format non autorisé : seuls JPG, PNG et MP4 sont acceptés');
  err.code = 'FORMAT_INTERDIT';
  cb(err); // Multer arrête tout et supprime les fichiers déjà écrits (NF3)
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: TAILLE_MAX_MO * 1024 * 1024, files: NB_MAX_FICHIERS },
});

// Enveloppe pour renvoyer des messages clairs en 400 au lieu d'une erreur 500
function uploadMedias(req, res, next) {
  upload.array('medias', NB_MAX_FICHIERS)(req, res, (err) => {
    if (!err) return next();
    if (err.code === 'FORMAT_INTERDIT') return res.status(400).json({ erreur: err.message });
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ erreur: `Fichier trop volumineux (maximum ${TAILLE_MAX_MO} Mo)` });
    }
    if (err.code === 'LIMIT_FILE_COUNT' || err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        erreur: `Envoyez au maximum ${NB_MAX_FICHIERS} fichiers dans le champ "medias"`,
      });
    }
    next(err);
  });
}

module.exports = { uploadMedias, TYPES, UPLOAD_DIR };
