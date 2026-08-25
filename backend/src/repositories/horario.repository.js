const { pool } = require('../config/database');

async function listarHorarios() {
  const [rows] = await pool.query(
    `SELECT id, dia_semana, atiende, hora_inicio, hora_fin
    FROM horario_atencion
    ORDER BY dia_semana`
  );

  return rows;
}

async function obtenerPorDia(diaSemana) {
  const [rows] = await pool.query(
    `SELECT id, dia_semana, atiende, hora_inicio, hora_fin
    FROM horario_atencion
    WHERE dia_semana = ?`,
    [diaSemana]
  );

  return rows[0];
}

async function actualizarHorario(diaSemana, horario) {
  await pool.query(
    `UPDATE horario_atencion
    SET atiende = ?,
      hora_inicio = ?,
      hora_fin = ?
    WHERE dia_semana = ?`,
    [horario.atiende, horario.hora_inicio, horario.hora_fin, diaSemana]
  );
}

async function listarFechasBloqueadas() {
  const [rows] = await pool.query(
    `SELECT id, DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha, motivo
    FROM fecha_bloqueada
    ORDER BY fecha`
  );

  return rows;
}

async function obtenerFechaBloqueada(fecha) {
  const [rows] = await pool.query(
    `SELECT id, DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha, motivo
    FROM fecha_bloqueada
    WHERE fecha = ?`,
    [fecha]
  );

  return rows[0];
}

async function crearFechaBloqueada(fecha, motivo) {
  const [result] = await pool.query(
    'INSERT INTO fecha_bloqueada (fecha, motivo) VALUES (?, ?)',
    [fecha, motivo]
  );

  return result.insertId;
}

async function eliminarFechaBloqueada(id) {
  await pool.query(
    'DELETE FROM fecha_bloqueada WHERE id = ?',
    [id]
  );
}

module.exports = {
  listarHorarios,
  obtenerPorDia,
  actualizarHorario,
  listarFechasBloqueadas,
  obtenerFechaBloqueada,
  crearFechaBloqueada,
  eliminarFechaBloqueada
};
