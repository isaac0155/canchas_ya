const mysql = require('mysql2/promise');
const env = require('./env');

const pool = mysql.createPool({
  host: env.database.host,
  user: env.database.user,
  password: env.database.password,
  database: env.database.name,
  waitForConnections: true,
  connectionLimit: 10
});

async function probarConexion() {
  const [rows] = await pool.query('SELECT 1 AS conectado');
  return rows[0].conectado === 1;
}

module.exports = {
  pool,
  probarConexion
};
