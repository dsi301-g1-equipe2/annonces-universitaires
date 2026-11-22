require('dotenv').config();
const express = require('express');
const connecterDb = require('./src/config/db');
const logger = require('./src/middlewares/logger');
const notFound = require('./src/middlewares/notFound');
const erreur = require('./src/middlewares/erreur');
const cookieParser = require('cookie-parser');
const securite = require('./src/middlewares/securite');


const app = express();

app.set('trust proxy', 1); // Azure passe par un proxy HTTPS : nécessaire pour le cookie secure

app.use(logger);
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.use(securite);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', require('./src/routes/api'));
app.use('/', require('./src/routes/web'));

app.use(notFound);
app.use(erreur);

connecterDb()
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Serveur sur http://localhost:${port}`));
  })
  .catch((err) => {
    console.error('Connexion MongoDB impossible :', err.message);
    process.exit(1);
  });


