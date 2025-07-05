// src/models/Libro.js

const mongoose = require('mongoose');

const libroSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    maxlength: 30
  },
  autor: {
    type: String,
    required: true,
    maxlength: 30
  },
  categoria: {
    type: String,
    required: true,
    maxlength: 30
  },
  año_publicacion: {
    type: Date,
    required: true
  },
  isbn: {
    type: String,
    required: true,
    maxlength: 13
  }
});

module.exports = mongoose.model('Libro', libroSchema);
