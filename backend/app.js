require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: ['https://dsi301-g1-equipe2.github.io', 'http://localhost:4200']
}));

app.get('/health', (req, res) => res.send('ok'));

app.get('/api/info', (req, res) => res.json({ nom: 'annonces universitaires' }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Serveur sur le port ${port}`));