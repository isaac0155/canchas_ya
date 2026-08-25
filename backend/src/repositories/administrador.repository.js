const { pool } = require('../config/database');

async function obtenerPorEmail(email) {
  const [rows] = await pool.query(
    `SELECT id, nombre, email, password_hash, estado
    FROM administrador
    WHERE email = ?`,
    [email]
  );

  return rows[0];
}

async function obtenerPorId(id) {
  const [rows] = await pool.query(
    `SELECT id, nombre, email, estado
    FROM administrador
    WHERE id = ?`,
    [id]
  );

  return rows[0];
}

async function crear(administrador) {
  const [result] = await pool.query(
    `INSERT INTO administrador
      (nombre, email, password_hash, estado)
    VALUES (?, ?, ?, ?)`,
    [
      administrador.nombre,
      administrador.email,
      administrador.password_hash,
      administrador.estado
    ]
  );

  return result.insertId;
}

module.exports = {
  obtenerPorEmail,
  obtenerPorId,
  crear
};
