const router = require('express').Router();
const mongoose = require('mongoose');
const fs = require('fs/promises');
const path = require('path');
const { Announcement } = require('../../models');
const { uploadMedias, TYPES, UPLOAD_DIR } = require('../../middlewares/upload');

// Charge l'annonce et vérifie que l'utilisateur connecté en est l'auteur.
// Placé AVANT Multer : si ce n'est pas l'auteur, aucun fichier n'est écrit.
async function chargerMonAnnonce(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ erreur: 'Annonce introuvable' });
  }
  const annonce = await Announcement.findById(req.params.id);
  if (!annonce) return res.status(404).json({ erreur: 'Annonce introuvable' });
  if (!annonce.auteur.equals(req.user._id)) {
    return res.status(403).json({ erreur: "Vous n'êtes pas l'auteur de cette annonce" });
  }
  req.annonce = annonce;
  next();
}

async function supprimerFichiers(noms) {
  await Promise.all(noms.map((nom) => fs.unlink(path.join(UPLOAD_DIR, nom)).catch(() => {})));
}

// POST /api/announcements/:id/medias : ajouter des fichiers (champ "medias") (US19)
router.post('/:id/medias', chargerMonAnnonce, uploadMedias, async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ erreur: 'Aucun fichier reçu (champ "medias")' });
  }
  for (const f of req.files) {
    req.annonce.medias.push({ type: TYPES[f.mimetype], url: `/uploads/medias/${f.filename}` });
  }
  try {
    await req.annonce.save();
  } catch (err) {
    await supprimerFichiers(req.files.map((f) => f.filename)); // pas de fichiers orphelins
    throw err;
  }
  res.status(201).json(req.annonce.medias);
});

// DELETE /api/announcements/:id/medias/:mediaId : retirer un média (US19)
router.delete('/:id/medias/:mediaId', chargerMonAnnonce, async (req, res) => {
  const media = mongoose.isValidObjectId(req.params.mediaId)
    ? req.annonce.medias.id(req.params.mediaId)
    : null;
  if (!media) return res.status(404).json({ erreur: 'Média introuvable' });

  const url = media.url;
  media.deleteOne();
  await req.annonce.save();

  if (url.startsWith('/uploads/medias/')) await supprimerFichiers([path.basename(url)]);
  res.json(req.annonce.medias);
});

module.exports = router;
