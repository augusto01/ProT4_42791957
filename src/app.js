// src/app.js

const express = require('express');
const app = express();
const bookRoutes = require('./routes/books');

app.use(express.json()); // Para leer JSON del body
app.use('/api/books', bookRoutes); // Prefijo para todas las rutas

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
