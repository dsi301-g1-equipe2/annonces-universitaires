const router = require('express').Router();
const { Announcement } = require('../../models');

router.get('/pending', async (req, res) => {
    try {
        const annonces = await Announcement.find({
            statut: 'EN_ATTENTE'
        }).sort({ createdAt: 1 });
        res.status(200).json(annonces);

    } catch (err) {
        res.status(500).json({
            erreur: 'Erreur lors de la récupération des annonces'
        });
    }
});

module.exports = router;
