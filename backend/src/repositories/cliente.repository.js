const { pool } = require('../config/database');

async function listarActivos() {
  const [rows] = await pool.query(
    `SELECT id, nombre, telefono, estado, fecha_registro
    FROM cliente
    WHERE estado = ?
    ORDER BY nombre`,
    ['activo']
  );

  return rows;
}

async function obtenerPorId(id) {
  const [rows] = await pool.query(
    `SELECT id, nombre, telefono, estado, fecha_registro
    FROM cliente
    WHERE id = ?`,
    [id]
  );

  return rows[0];
}

async function obtenerPorTelefono(telefono) {
  const [rows] = await pool.query(
    `SELECT id, nombre, telefono, estado, fecha_registro
    FROM cliente
    WHERE telefono = ?`,
    [telefono]
  );

  return rows[0];
}

async function crear(cliente) {
  const [result] = await pool.query(
    `INSERT INTO cliente
      (nombre, telefono, estado)
    VALUES (?, ?, ?)`,
    [cliente.nombre, cliente.telefono, cliente.estado]
  );

  return result.insertId;
}

async function actualizar(id, cliente) {
  await pool.query(
    `UPDATE cliente
    SET nombre = ?,
      telefono = ?,
      estado = ?
    WHERE id = ?`,
    [cliente.nombre, cliente.telefono, cliente.estado, id]
  );
}

async function desactivar(id) {
  await pool.query(
    'UPDATE cliente SET estado = ? WHERE id = ?',
    ['inactivo', id]
  );
}

module.exports = {
  listarActivos,
  obtenerPorId,
  obtenerPorTelefono,
  crear,
  actualizar,
  desactivar
};
