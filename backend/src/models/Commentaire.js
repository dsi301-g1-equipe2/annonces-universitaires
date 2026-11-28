const mongoose = require('mongoose');

const commentaireSchema = new mongoose.Schema({
  contenu: { type: String, required: [true, 'Contenu requis'], trim: true, minlength: 1, maxlength: 1000 },
  date: { type: Date, default: Date.now },
  masque: { type: Boolean, default: false },
  auteur: { type: mongoose.Schema.Types.ObjectId, ref: 'Etudiant', required: [true, 'Auteur requis'] },
  annonce: { type: mongoose.Schema.Types.ObjectId, ref: 'Annonce', required: [true, 'Annonce requise'], index: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Commentaire', default: null }, // "répond à"
});

commentaireSchema.methods.repondre = function (contenu, auteurId) {
  return this.constructor.create({ contenu, auteur: auteurId, annonce: this.annonce, parent: this._id });
};

module.exports = mongoose.model('Commentaire', commentaireSchema);