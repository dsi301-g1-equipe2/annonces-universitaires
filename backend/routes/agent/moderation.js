const router = require('express').Router();
const mongoose = require('mongoose');
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

router.get('/:id', async (req, res) => {
    try {
        const {id}=req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                erreur: 'Identifiant invalide'
            });
        }
        const annonce = await Announcement.findById(id);
        if (!annonce) {
            return res.status(404).json({
                erreur: 'Annonce introuvable'
            });
        }
        res.status(200).json(annonce);

    } catch (err) {
        res.status(500).json({
            erreur: 'Erreur lors de la récupération de l annonce'
        });
    }
});

router.post('/:id/validate', async (req, res) => {
    try {
        const {id}=req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                erreur: 'Identifiant invalide'
            });
        }
        const annonce = await Announcement.findById(id);
        if (!annonce) {
            return res.status(404).json({
                erreur: 'Annonce introuvable'
            });
        }
        if (annonce.statut !== 'EN_ATTENTE') {
            return res.status(409).json({
                erreur: 'Cette annonce a déjà été traitée'
            });
        }
        annonce.statut = 'PUBLIEE';
        annonce.dateTraitement = new Date();
        annonce.traitePar = req.user._id;
        await annonce.save();
        res.status(200).json({
            message: 'Annonce validée avec succès',
            annonce
        });

    } catch (err) {
        res.status(500).json({
            erreur: 'Erreur lors de la validation de l annonce'
        });
    }
});

router.post('/:id/reject', async (req, res) => {
    try {
        const {id}=req.params;
        const {motifRefus} = req.body;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                erreur: 'Identifiant invalide'
            });
        }
        if (typeof motifRefus !== 'string' || !motifRefus.trim()) {
            return res.status(400).json({
                erreur: 'Le motif de refus est obligatoire'
            });
        }
        const annonce = await Announcement.findById(id);
        if (!annonce) {
            return res.status(404).json({
                erreur: 'Annonce introuvable'
            });
        }
        if (annonce.statut !== 'EN_ATTENTE') {
            return res.status(409).json({
                erreur: 'Cette annonce a déjà été traitée'
            });
        }
        annonce.statut = 'REFUSEE';
        annonce.motifRefus = motifRefus.trim();
        annonce.dateTraitement = new Date();
        annonce.traitePar = req.user._id;
        await annonce.save();
        res.status(200).json({
            message: 'Annonce refusée avec succès',
            annonce
        });

    } catch (err) {
        res.status(500).json({
            erreur: 'Erreur lors du refus de l annonce'
        });
    }
});

module.exports = router;
