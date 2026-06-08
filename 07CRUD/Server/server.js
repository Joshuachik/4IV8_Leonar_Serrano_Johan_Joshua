const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3000;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'n0m3l0',
    database: 'pnt_practica1'
});

app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Servidor inicializado en el puerto ${PORT}`);
});