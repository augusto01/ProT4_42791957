// src/config/db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'biblioteca'
});

connection.connect(err => {
  if (err) {
    console.error(' Error al conectar a MySQL:', err);
    return;
  }
  console.log(' Conectado a MySQL con éxito');
});

module.exports = connection;
