const jwt = require('jsonwebtoken');

function creerToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || '2h',
  });
}

function verifierToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET); 
}

module.exports = { creerToken, verifierToken };