
const Announcement = require('../models/Announcement');

const trouverAnnoncesEnAttente = (limite, saut) => {
    return Announcement.find({ statut: 'EN_ATTENTE' })
        .sort({ createdAt: 1 })
        .skip(saut)
        .limit(limite)
        .populate('auteur', 'nom prenom emailInstitutionnel')
        .populate('categorie', 'nom');
};

const compterAnnoncesEnAttente = () => {
    return Announcement.countDocuments({ statut: 'EN_ATTENTE' });
};

const trouverParId = (id) => {
    return Announcement.findById(id)
        .populate('auteur', 'nom prenom emailInstitutionnel')
        .populate('categorie', 'nom');
};

const traiterSiEnAttente = (id, modifications) => {
    return Announcement.findOneAndUpdate(
        {
            _id: id,
            statut: 'EN_ATTENTE'
        },
        { $set: modifications },
        {
            new: true,
            runValidators: true
        }
    );
};

module.exports = {
    trouverAnnoncesEnAttente,
    compterAnnoncesEnAttente,
    trouverParId,
    traiterSiEnAttente
};
