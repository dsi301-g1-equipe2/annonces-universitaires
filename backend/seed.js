require('dotenv').config();
const mongoose = require('mongoose');
const Agent = require('./src/models/Agent');
const Etudiant = require('./src/models/Etudiant');
const Categorie = require('./src/models/Categorie');
const Annonce = require('./src/models/Annonce');
const Media = require('./src/models/Media');
const Commentaire = require('./src/models/Commentaire');
const Signalement = require('./src/models/Signalement');
const Notification = require('./src/models/Notification');

const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64'
);
const carte = { data: PNG, contentType: 'image/png' };

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  await Promise.all([
    Agent, Etudiant, Categorie, Annonce, Media, Commentaire, Signalement, Notification,
  ].map((m) => m.deleteMany({})));

  // ---------- Agent ----------
  const agent = await Agent.create({
    nom: 'Admin', prenom: 'Agent', email: 'agent@faculte.tn', motDePasse: 'Agent123!',
  });

  // ---------- Étudiants EN_ATTENTE (US10, US11) ----------
  for (const n of ['Ali', 'Sana', 'Youssef']) {
    await Etudiant.create({
      nom: n, prenom: 'Test',
      emailInstitutionnel: `${n.toLowerCase()}@isetch.tn`,
      motDePasse: 'Etudiant123!',
      carteEtudiant: carte,
    });
  }

  // ---------- Étudiants dans les autres statuts ----------
  const [mariem, karim, nour, omar, hedi] = await Etudiant.create([
    { nom: 'Mariem', prenom: 'Actif', emailInstitutionnel: 'mariem@isetch.tn', motDePasse: 'Etudiant123!',
      carteEtudiant: carte, statut: 'ACTIF', traitePar: agent._id, dateDecision: new Date() },
    { nom: 'Karim', prenom: 'Actif', emailInstitutionnel: 'karim@isetch.tn', motDePasse: 'Etudiant123!',
      carteEtudiant: carte, statut: 'ACTIF', traitePar: agent._id, dateDecision: new Date() },
    { nom: 'Nour', prenom: 'Refusee', emailInstitutionnel: 'nour@isetch.tn', motDePasse: 'Etudiant123!',
      carteEtudiant: carte, statut: 'REFUSE', motifRefus: 'Carte étudiant illisible',
      traitePar: agent._id, dateDecision: new Date() },
    { nom: 'Omar', prenom: 'Suspendu', emailInstitutionnel: 'omar@isetch.tn', motDePasse: 'Etudiant123!',
      carteEtudiant: carte, statut: 'SUSPENDU', traitePar: agent._id, dateDecision: new Date() },
    { nom: 'Hedi', prenom: 'Bloque', emailInstitutionnel: 'hedi@isetch.tn', motDePasse: 'Etudiant123!',
      carteEtudiant: carte, statut: 'BLOQUE', traitePar: agent._id, dateDecision: new Date() },
  ]);

  // ---------- Catégories (US13 à US17) ----------
  const [club, objetPerdu, evenement, covoiturage] = await Categorie.create([
    { nom: 'Club', description: 'Annonces des clubs de la faculté' },
    { nom: 'Objet perdu', description: 'Objets perdus ou trouvés' },
    { nom: 'Événement', description: 'Événements et sorties' },
    { nom: 'Covoiturage', description: 'Trajets partagés' },
  ]);

  // ---------- Annonces (tous les statuts) ----------
  const [a1, a2, a3, a4, a5, a6, a7, a8, a9] = await Annonce.create([
    // PUBLIEE : feed, détail, filtre, recherche
    { titre: 'Recrutement club robotique', description: 'Le club robotique recrute de nouveaux membres cette semaine.',
      statut: 'PUBLIEE', datePublication: new Date(), auteur: mariem._id, categorie: club._id, traitePar: agent._id },
    { titre: 'Clés perdues près de la bibliothèque', description: 'J ai perdu un trousseau de clés avec un porte-clés rouge.',
      statut: 'PUBLIEE', datePublication: new Date(), auteur: karim._id, categorie: objetPerdu._id, traitePar: agent._id },
    { titre: 'Journée portes ouvertes', description: 'Venez découvrir les départements et les projets étudiants.',
      statut: 'PUBLIEE', datePublication: new Date(), auteur: mariem._id, categorie: evenement._id, traitePar: agent._id },
    { titre: 'Covoiturage Tunis - Charguia', description: 'Je propose un trajet tous les matins depuis Tunis centre.',
      statut: 'PUBLIEE', datePublication: new Date(), auteur: karim._id, categorie: covoiturage._id, traitePar: agent._id },
    // EN_ATTENTE : liste à valider (US26, US27, US28)
    { titre: 'Tournoi de football inter-classes', description: 'Inscription ouverte pour le tournoi de fin de mois.',
      auteur: mariem._id, categorie: evenement._id },
    { titre: 'Carte étudiant trouvée', description: 'J ai trouvé une carte étudiant devant la cantine.',
      auteur: karim._id, categorie: objetPerdu._id },
    // REFUSEE (US28, US29)
    { titre: 'Vente de cours payants', description: 'Je vends des résumés de cours à prix élevé.',
      statut: 'REFUSEE', motifRefus: 'Contenu commercial non autorisé', auteur: mariem._id, categorie: club._id, traitePar: agent._id },
    // MASQUEE (US36)
    { titre: 'Annonce masquée par modération', description: 'Contenu masqué suite à un signalement traité.',
      statut: 'MASQUEE', datePublication: new Date(), auteur: karim._id, categorie: club._id, traitePar: agent._id },
    // RETROUVE / TERMINE (US21)
    { titre: 'Portefeuille retrouvé', description: 'Mon portefeuille a été retrouvé, merci à tous.',
      statut: 'RETROUVE', datePublication: new Date(), auteur: mariem._id, categorie: objetPerdu._id, traitePar: agent._id },
  ]);
  await Annonce.create({
    titre: 'Sortie à Hammamet terminée', description: 'La sortie a eu lieu, merci aux participants.',
    statut: 'TERMINE', datePublication: new Date(), auteur: karim._id, categorie: evenement._id, traitePar: agent._id,
  });

  // ---------- Médias (US19, US23) ----------
  await Media.create([
    { annonce: a1._id, type: 'PHOTO', url: 'https://example.com/uploads/robotique1.jpg' },
    { annonce: a1._id, type: 'PHOTO', url: 'https://example.com/uploads/robotique2.jpg' },
    { annonce: a3._id, type: 'VIDEO', url: 'https://example.com/uploads/portes-ouvertes.mp4' },
    { annonce: a2._id, type: 'PHOTO', url: 'https://example.com/uploads/cles.jpg' },
  ]);

  // ---------- Commentaires (US30 à US34) ----------
  const c1 = await Commentaire.create({ contenu: 'Comment on peut s inscrire ?', auteur: karim._id, annonce: a1._id });
  await Commentaire.create({ contenu: 'Passe nous voir au local du club.', auteur: mariem._id, annonce: a1._id, parent: c1._id });
  const c3 = await Commentaire.create({ contenu: 'Je les ai peut-être vues hier.', auteur: mariem._id, annonce: a2._id });
  const cInapp = await Commentaire.create({ contenu: 'Commentaire inapproprié de test', auteur: karim._id, annonce: a3._id });
  await Commentaire.create({ contenu: 'Commentaire déjà masqué', auteur: mariem._id, annonce: a4._id, masque: true });

  // ---------- Signalements (US35, US36) ----------
  await Signalement.create([
    { motif: 'Contenu inapproprié dans le commentaire', auteur: mariem._id, commentaire: cInapp._id },
    { motif: 'Annonce suspecte ou trompeuse', auteur: karim._id, annonce: a2._id },
    { motif: 'Signalement sans gravité', auteur: karim._id, annonce: a3._id, statut: 'IGNORE', traitePar: agent._id },
    { motif: 'Annonce déjà traitée par un agent', auteur: mariem._id, annonce: a8._id, statut: 'TRAITE', traitePar: agent._id },
  ]);

  // ---------- Notifications (US29, US32) ----------
  await Notification.create([
    { destinataire: mariem._id, type: 'VALIDATION_ANNONCE', message: 'Votre annonce "Recrutement club robotique" a été publiée.' },
    { destinataire: mariem._id, type: 'REFUS_ANNONCE', message: 'Votre annonce "Vente de cours payants" a été refusée : contenu commercial non autorisé.' },
    { destinataire: mariem._id, type: 'NOUVEAU_COMMENTAIRE', message: 'Karim a commenté votre annonce.', lue: true },
    { destinataire: karim._id, type: 'NOUVEAU_COMMENTAIRE', message: 'Mariem a commenté votre annonce.' },
    { destinataire: nour._id, type: 'REFUS_INSCRIPTION', message: 'Votre inscription a été refusée : carte étudiant illisible.' },
  ]);

  console.log('Seed terminé');
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });