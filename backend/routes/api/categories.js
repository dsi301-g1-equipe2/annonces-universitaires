const router = require('express').Router();
const { Category } = require('../../models');

// GET /api/categories : liste (id + nom) 
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ nom: 1 });
        const liste = categories.map(c => ({ id: c._id, nom: c.nom }));
        res.status(200).json(liste);
    } catch (err) {
        res.status(500).json({ erreur: 'Erreur lors de la récupération des catégories' });
    }
});

module.exports = router;
