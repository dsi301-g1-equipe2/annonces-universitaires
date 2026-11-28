const mongoose = require('mongoose');

const TYPES = ['VALIDATION_ANNONCE', 'REFUS_ANNONCE', 'NOUVEAU_COMMENTAIRE', 'REFUS_INSCRIPTION'];

const notificationSchema = new mongoose.Schema({
  destinataire: { type: mongoose.Schema.Types.ObjectId, ref: 'Etudiant', required: [true, 'Destinataire requis'], index: true },
  message: { type: String, required: [true, 'Message requis'], trim: true, maxlength: 500 },
  type: { type: String, enum: { values: TYPES, message: 'Type de notification invalide' }, required: true },
  dateEnvoi: { type: Date, default: Date.now },
  lue: { type: Boolean, default: false },
});

notificationSchema.statics.TYPES = TYPES;

notificationSchema.methods.marquerLue = function () {
  this.lue = true;
  return this.save();
};

module.exports = mongoose.model('Notification', notificationSchema);