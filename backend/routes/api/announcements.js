const router = require('express').Router();
const mongoose = require('mongoose');
const { Announcement, Category } = require('../../models');

router.post('/', async (req, res) => {
  const { titre, description, categorie } = req.body ?? {};
  const erreurs = [];

  if (typeof titre !== 'string' || !titre.trim()) erreurs.push('Le titre est obligatoire');
  else if (titre.trim().length < 3 || titre.trim().length > 100) {
    erreurs.push('Le titre doit faire entre 3 et 100 caractères');
  }

  if (typeof description !== 'string' || !description.trim()) erreurs.push('La description est obligatoire');
  else if (description.trim().length < 10 || description.trim().length > 2000) {
    erreurs.push('La description doit faire entre 10 et 2000 caractères');
  }

  if (!categorie) erreurs.push('La catégorie est obligatoire');
  else if (!mongoose.isValidObjectId(categorie) || !(await Category.exists({ _id: categorie }))) {
    erreurs.push("Cette catégorie n'existe pas");
  }

  if (erreurs.length) return res.status(400).json({ erreurs });

  const annonce = await Announcement.create({
    titre: titre.trim(),
    description: description.trim(),
    categorie,
    auteur: req.user._id,   
    statut: 'EN_ATTENTE',   
  });

  res.status(201).json(annonce);
});

module.exports = router;