const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const commentSchema = new mongoose.Schema({
  annonce: { type: ObjectId, ref: 'Announcement', required: true },
  auteur: { type: ObjectId, ref: 'Etudiant', required: true },
  contenu: { type: String, required: true },
  masque: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);