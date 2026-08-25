const { pool } = require('../config/database');

async function listarActivas() {
  const [rows] = await pool.query(
    `SELECT
      c.id,
      c.nombre,
      c.precio_por_hora,
      c.estado,
      c.tipo_cancha_id,
      tc.nombre AS tipo_cancha
    FROM cancha c
    INNER JOIN tipo_cancha tc ON tc.id = c.tipo_cancha_id
    WHERE c.estado <> ?
    ORDER BY c.nombre`,
    ['inactiva']
  );

  return rows;
}

async function obtenerPorId(id) {
  const [rows] = await pool.query(
    `SELECT
      c.id,
      c.nombre,
      c.precio_por_hora,
      c.estado,
      c.tipo_cancha_id,
      tc.nombre AS tipo_cancha
    FROM cancha c
    INNER JOIN tipo_cancha tc ON tc.id = c.tipo_cancha_id
    WHERE c.id = ?`,
    [id]
  );

  return rows[0];
}

async function obtenerPorNombre(nombre) {
  const [rows] = await pool.query(
    'SELECT id, nombre, estado FROM cancha WHERE nombre = ?',
    [nombre]
  );

  return rows[0];
}

async function crear(cancha) {
  const [result] = await pool.query(
    `INSERT INTO cancha
      (tipo_cancha_id, nombre, precio_por_hora, estado)
    VALUES (?, ?, ?, ?)`,
    [
      cancha.tipo_cancha_id,
      cancha.nombre,
      cancha.precio_por_hora,
      cancha.estado
    ]
  );

  return result.insertId;
}

async function actualizar(id, cancha) {
  await pool.query(
    `UPDATE cancha
    SET tipo_cancha_id = ?,
      nombre = ?,
      precio_por_hora = ?,
      estado = ?
    WHERE id = ?`,
    [
      cancha.tipo_cancha_id,
      cancha.nombre,
      cancha.precio_por_hora,
      cancha.estado,
      id
    ]
  );
}

async function desactivar(id) {
  await pool.query(
    'UPDATE cancha SET estado = ? WHERE id = ?',
    ['inactiva', id]
  );
}

module.exports = {
  listarActivas,
  obtenerPorId,
  obtenerPorNombre,
  crear,
  actualizar,
  desactivar
};
