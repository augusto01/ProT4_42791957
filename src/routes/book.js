const express = require('express');
const router = express.Router();
const bookController = require('../controllers/booksController');


//ruta para obtener todos los libros
router.get('/obtener-libros', bookController.getAll);

//ruta para obtener un libro por id
router.get('/obtener-un-libro/:id', bookController.getOne);

//ruta para crear un libro
router.post('/crear-libro', bookController.createBook);


//ruta para actualizar un libro
router.put('/actualizar-libro/:id', bookController.updateBook);

//ruta para eliminar un libro
router.delete('/eliminar-libro/:isbn', bookController.deleteBook);

module.exports = router;
