const Etudiant = require('../models/Etudiant');

const trouverParEmail = (email) =>
  Etudiant.findOne({ emailInstitutionnel: String(email).toLowerCase().trim() });

const creer = (donnees) => Etudiant.create(donnees);

module.exports = { trouverParEmail, creer };