// src/config/db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Dejalo vacío si estás usando XAMPP por defecto
  database: 'biblioteca'
});

connection.connect(err => {
  if (err) {
    console.error('❌ Error al conectar a MySQL:', err);
    return;
  }
  console.log('🟢 Conectado a MySQL');
});

module.exports = connection;
