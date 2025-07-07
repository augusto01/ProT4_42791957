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


//validaciones que se usaran en el metodo updateLibro
const validarCamposParciales = (campos) => {
  if (campos.nombre && campos.nombre.length > 30) {
    return 'El nombre no debe superar los 30 caracteres.';
  }
  if (campos.autor && campos.autor.length > 30) {
    return 'El autor no debe superar los 30 caracteres.';
  }
  if (campos.categoria && campos.categoria.length > 30) {
    return 'La categoría no debe superar los 30 caracteres.';
  }
  if (campos.isbn && campos.isbn.length !== 13) {
    return 'El ISBN debe tener exactamente 13 caracteres.';
  }
  if (campos.año_publicacion && isNaN(Date.parse(campos.año_publicacion))) {
    return 'La fecha de publicación no es válida.';
  }

  return null;
};



//metodo para obtener todos los libros
exports.getAll = async (req, res) => {
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
exports.getOne = async (req, res) => {
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
    const { nombre, autor, categoria, año_publicacion, isbn, ...extraCampos } = req.body;

    //Requerimiento del enunciado: solo se debe ingresar los campos: nombre, autor, categoria, año_publicacion, isbn
    const camposInvalidos = Object.keys(extraCampos);
    if (camposInvalidos.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: `Los siguientes campos no están permitidos: ${camposInvalidos.join(', ')}`
      });
    }

    // Validar que todos los campos requeridos estén presentes
    const error = validarLibro({ nombre, autor, categoria, año_publicacion, isbn });
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error
      });
    }

    db.query(
      'INSERT INTO libros (nombre, autor, categoria, año_publicacion, isbn) VALUES (?, ?, ?, ?, ?)',
      [nombre, autor, categoria, año_publicacion, isbn],
      (err, result) => {
        if (err) {

          // Se verifica que ya no haya un libro con el mismo ISBN
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
              status: 'error',
              message: 'El ISBN ya existe. Debe ser único.'
            });
          }
          throw err;
        }


        //si se cumple la inserción, se retorna el id del libro creado
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
      message: 'Error interno del servidor',
      detail: error.message
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

    if (Object.keys(campos).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Debes enviar al menos un campo para actualizar'
      });
    }

    // Validar campos válidos esperados
    const camposPermitidos = ['nombre', 'autor', 'categoria', 'año_publicacion', 'isbn'];
    const camposInvalidos = Object.keys(campos).filter(c => !camposPermitidos.includes(c));

    if (camposInvalidos.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: `Los siguientes campos no están permitidos: ${camposInvalidos.join(', ')}`
      });
    }

    // Validar formato de los campos recibidos
    const error = validarCamposParciales(campos);
    if (error) {
      return res.status(400).json({ status: 'error', message: error });
    }

    const camposSQL = Object.keys(campos).map(campo => `${campo} = ?`).join(', ');
    const valores = Object.values(campos);

    db.query(
      `UPDATE libros SET ${camposSQL} WHERE id = ?`,
      [...valores, id],
      (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
              status: 'error',
              message: 'El ISBN ya existe. Debe ser único.'
            });
          }
          throw err;
        }

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



//metodo para eliminar libro recibiendo el isbn
exports.deleteBook = async (req, res) => {
  try {
    const { isbn } = req.params;

    // Validación básica del ISBN
    if (!isbn || typeof isbn !== 'string' || isbn.length !== 13) {
      return res.status(400).json({
        status: 'error',
        message: 'El ISBN debe ser un string de exactamente 13 caracteres.'
      });
    }

    db.query('DELETE FROM libros WHERE isbn = ?', [isbn], (err, result) => {
      if (err) throw err;

      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Libro no encontrado'
        });
      }

      // Si se elimina correctamente, se retorna un mensaje de éxito
      res.status(200).json({
        status: 'success',
        message: 'Libro eliminado correctamente'
      });
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

