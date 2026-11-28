const mongoose = require('mongoose');

const STATUTS = ['EN_ATTENTE', 'IGNORE', 'TRAITE'];

const signalementSchema = new mongoose.Schema({
  motif: { type: String, required: [true, 'Motif requis'], trim: true, minlength: 5, maxlength: 500 },
  date: { type: Date, default: Date.now },
  statut: { type: String, enum: { values: STATUTS, message: 'Statut invalide' }, default: 'EN_ATTENTE' },
  auteur: { type: mongoose.Schema.Types.ObjectId, ref: 'Etudiant', required: [true, 'Auteur requis'] },
  traitePar: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
  annonce: { type: mongoose.Schema.Types.ObjectId, ref: 'Annonce' },
  commentaire: { type: mongoose.Schema.Types.ObjectId, ref: 'Commentaire' },
});

// Un signalement vise une annonce OU un commentaire, jamais les deux ni aucun
signalementSchema.pre('validate', function () {
  if (!!this.annonce === !!this.commentaire) {
    this.invalidate('annonce', 'Un signalement doit viser soit une annonce, soit un commentaire');
  }
});

signalementSchema.statics.STATUTS = STATUTS;

signalementSchema.methods.ignorer = function (agentId) {
  this.statut = 'IGNORE';
  this.traitePar = agentId;
  return this.save();
};

module.exports = mongoose.model('Signalement', signalementSchema);