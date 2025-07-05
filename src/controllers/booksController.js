// src/controllers/bookController.js
const db = require('../config/db');

exports.getAllBooks = (req, res) => {
  db.query('SELECT * FROM libros', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getBookById = (req, res) => {
  db.query('SELECT * FROM libros WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Libro no encontrado' });
    res.json(results[0]);
  });
};

exports.createBook = (req, res) => {
  const { nombre, autor, categoria, año_publicacion, isbn } = req.body;
  db.query(
    'INSERT INTO libros (nombre, autor, categoria, año_publicacion, isbn) VALUES (?, ?, ?, ?, ?)',
    [nombre, autor, categoria, año_publicacion, isbn],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, nombre, autor, categoria, año_publicacion, isbn });
    }
  );
};

exports.updateBook = (req, res) => {
  const { nombre, autor, categoria, año_publicacion, isbn } = req.body;
  db.query(
    'UPDATE libros SET nombre = ?, autor = ?, categoria = ?, año_publicacion = ?, isbn = ? WHERE id = ?',
    [nombre, autor, categoria, año_publicacion, isbn, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Libro no encontrado' });
      res.json({ id: req.params.id, nombre, autor, categoria, año_publicacion, isbn });
    }
  );
};

exports.deleteBook = (req, res) => {
  db.query('DELETE FROM libros WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Libro no encontrado' });
    res.status(204).send();
  });
};
