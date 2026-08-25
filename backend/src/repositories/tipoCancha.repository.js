const { pool } = require('../config/database');

async function listarActivos() {
  const [rows] = await pool.query(
    'SELECT id, nombre, estado FROM tipo_cancha WHERE estado = ? ORDER BY nombre',
    ['activo']
  );

  return rows;
}

async function obtenerPorId(id) {
  const [rows] = await pool.query(
    'SELECT id, nombre, estado FROM tipo_cancha WHERE id = ?',
    [id]
  );

  return rows[0];
}

async function obtenerPorNombre(nombre) {
  const [rows] = await pool.query(
    'SELECT id, nombre, estado FROM tipo_cancha WHERE nombre = ?',
    [nombre]
  );

  return rows[0];
}

async function crear(nombre) {
  const [result] = await pool.query(
    'INSERT INTO tipo_cancha (nombre) VALUES (?)',
    [nombre]
  );

  return result.insertId;
}

async function actualizar(id, nombre) {
  await pool.query(
    'UPDATE tipo_cancha SET nombre = ? WHERE id = ?',
    [nombre, id]
  );
}

async function desactivar(id) {
  await pool.query(
    'UPDATE tipo_cancha SET estado = ? WHERE id = ?',
    ['inactivo', id]
  );
}

module.exports = {
  listarActivos,
  obtenerPorId,
  obtenerPorNombre,
  crear,
  actualizar,
  desactivar
};
