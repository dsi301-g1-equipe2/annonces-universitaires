module.exports = (req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ erreur: 'Route introuvable' });
  }
  res.status(404).send('Page introuvable');
};