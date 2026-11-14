require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(cors({
  origin: ['https://dsi301-g1-equipe2.github.io', 'http://localhost:4200']
}));

mongoose.connect(process.env.MONGODB_URI, { dbName: 'annonces' })
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.error('Erreur MongoDB:', err.message));

const Info = mongoose.model('Info', new mongoose.Schema({ nom: String }));

app.get('/health', (req, res) => res.send('ok'));

app.get('/api/info', async (req, res) => {
  try {
    let doc = await Info.findOne();
    if (!doc) doc = await Info.create({ nom: 'annonces universitaires' });
    res.json({ nom: doc.nom });
  } catch (err) {
    res.status(500).json({ erreur: 'Base de données injoignable' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Serveur sur le port ${port}`));