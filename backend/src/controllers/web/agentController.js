const accueil = (req, res) => {
  res.render('layout', { page: 'pages/accueil', titre: 'Accueil' });
};

module.exports = { accueil };