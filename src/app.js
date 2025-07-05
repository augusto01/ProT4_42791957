const express = require('express');
const app = express();
const bookRoutes = require('./routes/book');

app.use(express.json());
app.use('/api/books', bookRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
