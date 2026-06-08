

const mysql = require('mysql2');


const pool = mysql.createPool({
    host: 'localhost',       
    user: 'root',            
    password: 'n0m3l0', 
    database: 'gym_crud',    
    waitForConnections: true,
    connectionLimit: 10,    
    queueLimit: 0
});


module.exports = pool.promise();