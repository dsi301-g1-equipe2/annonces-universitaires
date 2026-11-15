
const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  nom: { type: String, required: true, trim: true },
  prenom: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  motDePasse: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Agent', agentSchema);