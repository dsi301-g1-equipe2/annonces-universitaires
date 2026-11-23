
const mongoose = require('mongoose');

const announcementRepository = require('../repositories/announcementRepository');
const erreur = require('../util/erreur');

const LIMITE = 10;
const MAX_MOTIF = 500;

async function obtenirAnnoncesEnAttente(page = 1) {
    page = Number(page);
    if (!Number.isInteger(page) || page < 1) {
        throw erreur('Numéro de page invalide', 400);
    }

    const total = await announcementRepository.compterAnnoncesEnAttente();

    const totalPages = Math.ceil(total / LIMITE);
    const saut = (page - 1) * LIMITE;

    const annonces = await announcementRepository.trouverAnnoncesEnAttente(
        LIMITE,
        saut
    );

    return {
        annonces,
        page,
        totalPages,
        total
    };
}

async function obtenirAnnonce(id) {
    if (!mongoose.isValidObjectId(id)) {
        throw erreur('Identifiant invalide', 400);
    }
    const annonce = await announcementRepository.trouverParId(id);

    if (!annonce) {
        throw erreur('Annonce introuvable', 404);
    }

    return annonce;
}
async function verifierAnnonceEnAttente(id) {
    const annonce = await obtenirAnnonce(id);
    if (annonce.statut !== 'EN_ATTENTE') {
        throw erreur('Cette annonce a déjà été traitée', 409);
    }

    return annonce;
}

async function validerAnnonce(id, agentId) {
    await verifierAnnonceEnAttente(id);
    const annonce = await announcementRepository.traiterSiEnAttente(
        id,
        {
            statut: 'PUBLIEE',
            dateTraitement: new Date(),
            traitePar: agentId
        }
    );

    if (!annonce) {
        throw erreur('Cette annonce a déjà été traitée', 409);
    }

    return annonce;
}

async function refuserAnnonce(id, motifRefus, agentId) {
    if (typeof motifRefus !== 'string' || !motifRefus.trim()) {
        throw erreur('Le motif de refus est obligatoire', 400);
    }

    const motif = motifRefus.trim();

    if (motif.length > MAX_MOTIF) {
        throw erreur('Le motif ne doit pas dépasser 500 caractères', 400);
    }

    await verifierAnnonceEnAttente(id);

    const annonce = await announcementRepository.traiterSiEnAttente(
        id,
        {
            statut: 'REFUSEE',
            motifRefus: motif,
            dateTraitement: new Date(),
            traitePar: agentId
        }
    );

    if (!annonce) {
        throw erreur('Cette annonce a déjà été traitée', 409);
    }

    return annonce;
}

module.exports = {
    obtenirAnnoncesEnAttente,
    obtenirAnnonce,
    validerAnnonce,
    refuserAnnonce
};
