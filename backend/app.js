const { fakeAuth, requireRole } = require('./middlewares/auth');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const app = express();
const path = require('path'); 

app.use(cors({
  origin: ['https://dsi301-g1-equipe2.github.io', 'http://localhost:4200']
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

connectDB();

const Info = mongoose.model('Info', new mongoose.Schema({ nom: String }));
app.use(require('./routes'));
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