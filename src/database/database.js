const { createPool } = require('mysql')

const pool = createPool({
    port: process.env.DB_PORT,
    host: process.env.HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PWD,
    database: process.env.DB,
    connectionLimit: 10
})

module.exports = pool;
