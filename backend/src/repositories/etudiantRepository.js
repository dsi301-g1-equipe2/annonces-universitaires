const Etudiant = require('../models/Etudiant');

const trouverParEmail = (email) =>
  Etudiant.findOne({ emailInstitutionnel: String(email).toLowerCase().trim() });

const trouverParId = (id) => Etudiant.findById(id);

const creer = (donnees) => Etudiant.create(donnees);

module.exports = { trouverParEmail, trouverParId, creer };