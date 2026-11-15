require('dotenv').config();
const mongoose = require('mongoose');
const { Etudiant, Agent, Category, Announcement, Comment } = require('./models');

async function seed() {
  const uri = process.env.MONGODB_URI || '';
  if (!/127\.0\.0\.1|localhost/.test(uri)) {
    console.error('Seed refusé : MONGODB_URI ne pointe pas vers une base locale.');
    process.exit(1);
  }
  await mongoose.connect(uri, { dbName: 'annonces' });
for (const M of [Etudiant, Agent, Category, Announcement, Comment]) await M.deleteMany({});
const agent = await Agent.create({ nom: 'Agent', prenom: 'Test', email: 'agent@test.tn', motDePasse: 'test' });
const [etu1, etu2] = await Etudiant.create([
  { nom: 'Etudiant', prenom: 'Un', emailInstitutionnel: 'etu1@isetch.tn', motDePasse: 'test', statut: 'ACTIF' },
  { nom: 'Etudiant', prenom: 'Deux', emailInstitutionnel: 'etu2@isetch.tn', motDePasse: 'test', statut: 'ACTIF' },
]);
  const cats = await Category.create([{ nom: 'Objets perdus' }, { nom: 'Clubs' }, { nom: 'Ventes' }]);
  const now = new Date();
  const [a1] = await Announcement.create([
    { titre: 'Clés perdues au bloc B', description: 'Trouvées hier.', categorie: cats[0]._id, auteur: etu1._id,
      statut: 'PUBLIEE', traitePar: agent._id, dateTraitement: now, medias: [{ type: 'PHOTO', url: 'https://exemple.com/cles.jpg' }] },
    { titre: 'Réunion du club robotique', description: 'Jeudi à 14h.', categorie: cats[1]._id, auteur: etu2._id,
      statut: 'PUBLIEE', traitePar: agent._id, dateTraitement: now },
    { titre: 'Vente de livres', description: 'Livres de 2e année.', categorie: cats[2]._id, auteur: etu1._id },
    { titre: 'Annonce hors sujet', description: '...', categorie: cats[2]._id, auteur: etu2._id,
      statut: 'REFUSEE', motifRefus: 'Contenu hors sujet', traitePar: agent._id, dateTraitement: now },
  ]);
  await Comment.create([
    { annonce: a1._id, auteur: etu2._id, contenu: 'Je crois que ce sont les miennes !' },
    { annonce: a1._id, auteur: etu1._id, contenu: 'Contactez-moi en message privé.' },
  ]);

  console.log('Seed terminé. Identifiants à mettre dans l\'en-tête x-user-id :');
  console.log('agent    :', agent._id.toString());
  console.log('etudiant1:', etu1._id.toString());
  console.log('etudiant2:', etu2._id.toString());
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });