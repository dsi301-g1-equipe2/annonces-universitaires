
const moderationService = require('../../services/moderationService');

const afficherAnnoncesEnAttente = async (req, res, next) => {
    try {
        const resultat = await moderationService.obtenirAnnoncesEnAttente(
            req.query.page || 1
        );
        res.render('layout', {
            page: 'pages/annoncesEnAttente',
            titre: 'Modération des annonces',
            annonces: resultat.annonces,
            pagination: resultat,
            message: req.query.message || null,
            erreur: req.query.erreur || null
        });

    } catch (err) {
        next(err);
    }
};

const afficherDetailAnnonce = async (req, res, next) => {
    try {
        const annonce = await moderationService.obtenirAnnonce(req.params.id);

        res.render('layout', {
            page: 'pages/detailAnnonce',
            titre: 'Détail de l’annonce',
            annonce,
            erreur: null
        });

    } catch (err) {
        next(err);
    }
};

const validerAnnonce = async (req, res, next) => {
    try {
        await moderationService.validerAnnonce(
            req.params.id,
            req.agent.id
        );

        res.redirect('/agent/announcements/pending?message=Annonce+validée+avec+succès');

    } catch (err) {
        if (!err.status) return next(err);

        res.redirect(
            '/agent/announcements/pending?erreur=' +
            encodeURIComponent(err.message)
        );
    }
};

const refuserAnnonce = async (req, res, next) => {
    try {
        await moderationService.refuserAnnonce(
            req.params.id,
            req.body.motifRefus,
            req.agent.id
        );

        res.redirect('/agent/announcements/pending?message=Annonce+refusée+avec+succès');

    } catch (err) {
        if (!err.status) return next(err);

        res.redirect(
            '/agent/announcements/pending?erreur=' +
            encodeURIComponent(err.message)
        );
    }
};

module.exports = {
    afficherAnnoncesEnAttente,
    afficherDetailAnnonce,
    validerAnnonce,
    refuserAnnonce
};
