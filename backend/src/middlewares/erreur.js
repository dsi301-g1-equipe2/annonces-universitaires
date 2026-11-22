module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({
    erreur: status === 500 ? 'Erreur serveur' : err.message,
  });
};