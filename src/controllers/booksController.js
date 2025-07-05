const db = require('../config/db');

const validarLibro = ({ nombre, autor, categoria, año_publicacion, isbn }) => {
  if (!nombre || !autor || !categoria || !año_publicacion || !isbn) {
    return 'Todos los campos son obligatorios.';
  }

  if (nombre.length > 30 || autor.length > 30 || categoria.length > 30) {
    return 'Los campos nombre, autor y categoría no deben superar los 30 caracteres.';
  }

  if (isbn.length !== 13) {
    return 'El ISBN debe tener exactamente 13 caracteres.';
  }

  // Validar fecha válida
  if (isNaN(Date.parse(año_publicacion))) {
    return 'La fecha de publicación no es válida.';
  }

  return null; // No hay errores
};

exports.getAllBooks = async (req, res) => {
  try {
    db.query('SELECT * FROM libros', (err, results) => {
      if (err) throw err;

      if (results.length === 0) {
        return res.status(200).json({
          status: 'success',
          message: 'No hay libros registrados !',
          data: []
        });
      }

      res.status(200).json({
        status: 'success',
        message: 'Libros encontrados',
        data: results
      });
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getBookById = async (req, res) => {
  try {
    db.query('SELECT * FROM libros WHERE id = ?', [req.params.id], (err, results) => {
      if (err) throw err;

      if (results.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Libro no encontrado'
        });
      }

      res.status(200).json({
        status: 'success',
        message: 'Libro encontrado',
        data: results[0]
      });
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.createBook = async (req, res) => {
  try {
    const { nombre, autor, categoria, año_publicacion, isbn } = req.body;

    const error = validarLibro({ nombre, autor, categoria, año_publicacion, isbn });
    if (error) return res.status(400).json({
      status: 'error',
      message: error
    });

    db.query(
      'INSERT INTO libros (nombre, autor, categoria, año_publicacion, isbn) VALUES (?, ?, ?, ?, ?)',
      [nombre, autor, categoria, año_publicacion, isbn],
      (err, result) => {
        if (err) throw err;
        res.status(201).json({
          status: 'success',
          message: 'Libro creado exitosamente',
          data: { id: result.insertId, nombre, autor, categoria, año_publicacion, isbn }
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { nombre, autor, categoria, año_publicacion, isbn } = req.body;

    const error = validarLibro({ nombre, autor, categoria, año_publicacion, isbn });
    if (error) return res.status(400).json({
      status: 'error',
      message: error
    });

    db.query(
      'UPDATE libros SET nombre = ?, autor = ?, categoria = ?, año_publicacion = ?, isbn = ? WHERE id = ?',
      [nombre, autor, categoria, año_publicacion, isbn, req.params.id],
      (err, result) => {
        if (err) throw err;
        if (result.affectedRows === 0) return res.status(404).json({
          status: 'error',
          message: 'Libro no encontrado'
        });

        res.status(200).json({
          status: 'success',
          message: 'Libro actualizado exitosamente',
          data: { id: req.params.id, nombre, autor, categoria, año_publicacion, isbn }
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    db.query('DELETE FROM libros WHERE id = ?', [req.params.id], (err, result) => {
      if (err) throw err;
      if (result.affectedRows === 0) return res.status(404).json({
        status: 'error',
        message: 'Libro no encontrado'
      });
      res.status(204).send();
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
