const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true, trim: true },
  prenom: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  motDePasse: { type: String, required: true },
  role: { type: String, enum: ['etudiant', 'agent'], required: true },
  statut: { type: String, enum: ['EN_ATTENTE', 'ACTIF', 'REFUSE', 'SUSPENDU', 'BLOQUE'], default: 'ACTIF' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);