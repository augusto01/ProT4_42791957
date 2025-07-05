const db = require('../config/db');

// Función para validar los campos del libro
// Esta función valida los campos de un libro y devuelve un mensaje de error si hay algún problema
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


//metodo para obtener todos los libros
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


//metodo para obtener libro por id
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


//metodo para crear libro 
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

//metodo para actualizar libro
exports.updateBook = async (req, res) => {
  try {
    const campos = req.body;
    const id = req.params.id;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'ID inválido'
      });
    }

    // Validar que al menos se haya enviado algún campo
    if (Object.keys(campos).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Debes enviar al menos un campo para actualizar'
      });
    }

    // Validaciones mínimas por campo
    if (campos.nombre && campos.nombre.length > 30) {
      return res.status(400).json({ status: 'error', message: 'El nombre no debe superar los 30 caracteres' });
    }
    if (campos.autor && campos.autor.length > 30) {
      return res.status(400).json({ status: 'error', message: 'El autor no debe superar los 30 caracteres' });
    }
    if (campos.categoria && campos.categoria.length > 30) {
      return res.status(400).json({ status: 'error', message: 'La categoría no debe superar los 30 caracteres' });
    }
    if (campos.isbn && campos.isbn.length !== 13) {
      return res.status(400).json({ status: 'error', message: 'El ISBN debe tener 13 caracteres' });
    }
    if (campos.año_publicacion && isNaN(Date.parse(campos.año_publicacion))) {
      return res.status(400).json({ status: 'error', message: 'La fecha de publicación no es válida' });
    }

    // Armar dinámicamente SET de SQL
    const camposSQL = Object.keys(campos)
      .map(campo => `${campo} = ?`)
      .join(', ');

    const valores = Object.values(campos);

    db.query(
      `UPDATE libros SET ${camposSQL} WHERE id = ?`,
      [...valores, id],
      (err, result) => {
        if (err) throw err;

        if (result.affectedRows === 0) {
          return res.status(404).json({
            status: 'error',
            message: 'Libro no encontrado'
          });
        }

        res.status(200).json({
          status: 'success',
          message: 'Libro actualizado correctamente',
          data: { id, ...campos }
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
      res.status(204).json({
          status: 'success',
          message: 'Libro eliminado correctamente !',
          
        });
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
