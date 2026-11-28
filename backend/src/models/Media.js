const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  annonce: { type: mongoose.Schema.Types.ObjectId, ref: 'Annonce', required: [true, 'Annonce requise'], index: true },
  type: { type: String, enum: { values: ['PHOTO', 'VIDEO'], message: 'Type de média invalide' }, required: true },
  url: { type: String, required: [true, 'URL requise'], trim: true },
});

module.exports = mongoose.model('Media', mediaSchema);