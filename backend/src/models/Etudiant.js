const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const STATUTS = ['EN_ATTENTE', 'ACTIF', 'REFUSE', 'SUSPENDU', 'BLOQUE'];

const etudiantSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, trim: true },
    prenom: { type: String, required: true, trim: true },
    emailInstitutionnel: { type: String, required: true, unique: true, lowercase: true, trim: true },
    motDePasse: { type: String, required: true },
    carteEtudiant: {
      data: { type: Buffer, select: false }, 
      contentType: String,
    },
    statut: { type: String, enum: STATUTS, default: 'EN_ATTENTE' },
    motifRefus: String,
    traitePar: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' }, 
    dateDecision: Date,
  },
  { timestamps: { createdAt: 'dateInscription', updatedAt: true } }
);

etudiantSchema.statics.STATUTS = STATUTS;

etudiantSchema.pre('save', async function () {
  if (this.isModified('motDePasse')) {
    this.motDePasse = await bcrypt.hash(this.motDePasse, 10);
  }
});

etudiantSchema.methods.checkPassword = function (clair) {
  return bcrypt.compare(clair, this.motDePasse);
};

etudiantSchema.methods.toPublic = function () {
  return {
    id: this._id.toString(),
    nom: this.nom,
    prenom: this.prenom,
    emailInstitutionnel: this.emailInstitutionnel,
    statut: this.statut,
    motifRefus: this.motifRefus,
    dateInscription: this.dateInscription,
  };
};

module.exports = mongoose.model('Etudiant', etudiantSchema);