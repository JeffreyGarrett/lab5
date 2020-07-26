const mysql = require('mysql');

const pool  = mysql.createPool({
    connectionLimit: 10,
    host: process.env.dbHost,
    user: process.env.dbUser,
    password: process.env.dbPassword,
    database: process.env.database
});

module.exports = pool;
