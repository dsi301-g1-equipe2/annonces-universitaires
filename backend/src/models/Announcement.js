
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const mediaSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['PHOTO', 'VIDEO'],
        required: true
    },
    url: {
        type: String,
        required: true
    }
});

const announcementSchema = new mongoose.Schema({
    titre: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    categorie: {
        type: ObjectId,
        ref: 'Category',
        required: true
    },
    auteur: {
        type: ObjectId,
        ref: 'Etudiant',
        required: true
    },
    statut: {
        type: String,
        enum: ['EN_ATTENTE', 'PUBLIEE', 'REFUSEE'],
        default: 'EN_ATTENTE'
    },
    medias: [mediaSchema],
    motifRefus: String,
    traitePar: {
        type: ObjectId,
        ref: 'Agent'
    },
    dateTraitement: Date
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
