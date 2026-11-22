const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');


const dossierModeles = path.join(__dirname, '../models');
fs.readdirSync(dossierModeles)
  .filter((f) => f.endsWith('.js'))
  .forEach((f) => require(path.join(dossierModeles, f)));

async function connecterDb() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connecté');

  for (const Model of Object.values(mongoose.models)) {
    try {
      await Model.init();
    } catch (err) {
      console.warn(`Index ${Model.modelName} non créé :`, err.message);
    }
  }
}

module.exports = connecterDb;