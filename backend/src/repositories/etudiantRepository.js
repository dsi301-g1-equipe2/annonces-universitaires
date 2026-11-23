const Etudiant = require('../models/Etudiant');

const trouverParEmail = (email) =>
  Etudiant.findOne({ emailInstitutionnel: String(email).trim().toLowerCase() });

const trouverParId = (id) => Etudiant.findById(id);

module.exports = { trouverParEmail, trouverParId };