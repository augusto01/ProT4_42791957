const express = require('express');
const router = express.Router();
const bookController = require('../controllers/booksController');

router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);

//ruta para crear un libro
router.post('/crear-libro', bookController.createBook);


//ruta para actualizar un libro
router.put('/actualizar-libro/:id', bookController.updateBook);

//ruta para eliminar un libro
router.delete('/eliminar-libro/:id', bookController.deleteBook);

module.exports = router;
