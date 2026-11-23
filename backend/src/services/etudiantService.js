const etudiantRepository = require('../repositories/etudiantRepository');
const erreur = require('../util/erreur');

const DOMAINE = '@isetch.tn';

async function register(donnees, carte) {
  const { nom, prenom, emailInstitutionnel, motDePasse } = donnees;
  const email = String(emailInstitutionnel).toLowerCase().trim();

  if (!email.endsWith(DOMAINE)) {
    throw erreur(`Utilisez votre e-mail institutionnel (${DOMAINE})`, 400);
  }
  if (String(motDePasse).length < 8) {
    throw erreur('Le mot de passe doit contenir au moins 8 caractères', 400);
  }
  if (!carte) {
    throw erreur('La carte étudiante est obligatoire', 400);
  }
  if (await etudiantRepository.trouverParEmail(email)) {
    throw erreur('Cet e-mail est déjà utilisé', 409);
  }

  const etudiant = await etudiantRepository.creer({
    nom,
    prenom,
    emailInstitutionnel: email,
    motDePasse,
    carteEtudiant: { data: carte.buffer, contentType: carte.mimetype },
  });

  return etudiant.toPublic();
}

module.exports = { register };