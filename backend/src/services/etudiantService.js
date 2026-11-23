const etudiantRepository = require('../repositories/etudiantRepository');
const { creerToken } = require('../util/token');
const erreur = require('../util/erreur');

const MESSAGES_STATUT = {
  EN_ATTENTE: () => 'Votre compte est en attente de validation par un agent.',
  REFUSE: (e) =>
    `Votre inscription a été refusée.${e.motifRefus ? ` Motif : ${e.motifRefus}` : ''}`,
  SUSPENDU: () => 'Votre compte est suspendu. Contactez l’administration.',
  BLOQUE: () => 'Votre compte est bloqué. Contactez l’administration.',
};

function verifierStatut(etudiant) {
  if (etudiant.statut === 'ACTIF') return;
  const message = MESSAGES_STATUT[etudiant.statut];
  throw erreur(message ? message(etudiant) : 'Connexion non autorisée', 403);
}

async function login(email, motDePasse) {
  if (typeof email !== 'string' || typeof motDePasse !== 'string' || !email || !motDePasse) {
    throw erreur('Email et mot de passe obligatoires', 400);
  }
  const etudiant = await etudiantRepository.trouverParEmail(email);
  if (!etudiant || !(await etudiant.checkPassword(motDePasse))) {
    throw erreur('Email ou mot de passe incorrect', 401);
  }
  verifierStatut(etudiant);

  const token = creerToken({ id: etudiant._id.toString(), role: 'etudiant' });
  return { token, etudiant: etudiant.toPublic() };
}

const trouverParId = (id) => etudiantRepository.trouverParId(id);

module.exports = { login, trouverParId };