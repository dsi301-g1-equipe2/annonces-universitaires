require('dotenv').config();
const mongoose = require('mongoose');
const Agent = require('./src/models/Agent');
const Etudiant = require('./src/models/Etudiant');

const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64'
);

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  await Agent.deleteMany({});
  await Etudiant.deleteMany({});

  await Agent.create({
    nom: 'Admin', prenom: 'Agent', email: 'agent@faculte.tn', motDePasse: 'Agent123!',
  });

  for (const n of ['Ali', 'Sana', 'Youssef']) {
    await Etudiant.create({
      nom: n, prenom: 'Test',
      emailInstitutionnel: `${n.toLowerCase()}@isetch.tn`,
      motDePasse: 'Etudiant123!',
      carteEtudiant: { data: PNG, contentType: 'image/png' },
    });
  }

  console.log('Seed terminé : 1 agent, 3 étudiants EN_ATTENTE');
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });