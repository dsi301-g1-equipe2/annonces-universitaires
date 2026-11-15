
const mongoose = require('mongoose');

const etudiantSchema = new mongoose.Schema({
  nom: { type: String, required: true, trim: true },
  prenom: { type: String, required: true, trim: true },
  emailInstitutionnel: {
  type: String, required: true, unique: true, lowercase: true, trim: true,
  match: [/^[^\s@]+@isetch\.tn$/, 'Adresse email institutionnelle requise'],
},
  motDePasse: { type: String, required: true },
carteEtudiant: {
  data: { type: Buffer, select: false },   
  contentType: { type: String },          
},         
  statut: { type: String, enum: ['EN_ATTENTE', 'ACTIF', 'REFUSE', 'SUSPENDU', 'BLOQUE'], default: 'EN_ATTENTE' },
  motifRefus: { type: String },
}, { timestamps: true });                    

module.exports = mongoose.model('Etudiant', etudiantSchema);