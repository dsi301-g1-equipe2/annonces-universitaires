const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const agentSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, trim: true },
    prenom: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    motDePasse: { type: String, required: true },
  },
  { timestamps: true }
);


agentSchema.pre('save', async function () {
  if (this.isModified('motDePasse')) {
    this.motDePasse = await bcrypt.hash(this.motDePasse, 10);
  }
});

agentSchema.methods.checkPassword = function (clair) {
  return bcrypt.compare(clair, this.motDePasse);
};

agentSchema.methods.toPublic = function () {
  return { id: this._id.toString(), nom: this.nom, prenom: this.prenom, email: this.email };
};

module.exports = mongoose.model('Agent', agentSchema);