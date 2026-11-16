const router = require('express').Router();
const { Category } = require('../../models');

// GET /admin/categories : toutes les catégories pour l'agent
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ nom: 1 });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ erreur: 'Erreur lors de la récupération des catégories' });
  }
});

// POST /admin/categories : l'agent crée une catégorie avec { nom }
router.post('/', async (req, res) => {
  try {
    const nom = (req.body?.nom || '').trim();

    if (!nom) {
      return res.status(400).json({ erreur: 'Le nom est obligatoire' });
    }

    // nom deja utilisé
    const existe = await Category.findOne({ nom }).collation({ locale: 'fr', strength: 2 });
    if (existe) {
      return res.status(409).json({ erreur: 'Cette catégorie existe déjà' });
    }

    const categorie = await Category.create({ nom });
    res.status(201).json(categorie);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ erreur: 'Cette catégorie existe déjà' });
    }
    res.status(500).json({ erreur: 'Erreur lors de la création de la catégorie' });
  }
});

module.exports = router;
