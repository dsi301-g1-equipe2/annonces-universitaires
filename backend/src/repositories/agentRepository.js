const Agent = require('../models/Agent');

const trouverParEmail = (email) =>
  Agent.findOne({ email: String(email).toLowerCase().trim() });

const trouverParId = (id) => Agent.findById(id);

module.exports = { trouverParEmail, trouverParId };