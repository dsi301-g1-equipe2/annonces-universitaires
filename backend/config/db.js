const mongoose = require('mongoose');
require('../models');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'annonces' });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Erreur MongoDB:', err.message);
  }
}

module.exports = connectDB;