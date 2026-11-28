const mongoose = require('mongoose');

const categorieSchema = new mongoose.Schema({
  nom: { type: String, required: [true, 'Nom requis'], unique: true, trim: true, minlength: 2, maxlength: 50 },
  description: { type: String, trim: true, maxlength: 300 },
});

module.exports = mongoose.model('Categorie', categorieSchema);