const { pool } = require('../config/database');

async function listar(filtros) {
  let sql = `
    SELECT
      r.id,
      DATE_FORMAT(r.fecha_reserva, '%Y-%m-%d') AS fecha_reserva,
      r.hora_inicio,
      r.hora_fin,
      r.estado,
      r.origen,
      r.recordatorio_enviado,
      r.fecha_creacion,
      r.cliente_id,
      cl.nombre AS cliente,
      cl.telefono AS telefono_cliente,
      r.cancha_id,
      ca.nombre AS cancha,
      ca.precio_por_hora,
      tc.nombre AS tipo_cancha
    FROM reserva r
    INNER JOIN cliente cl ON cl.id = r.cliente_id
    INNER JOIN cancha ca ON ca.id = r.cancha_id
    INNER JOIN tipo_cancha tc ON tc.id = ca.tipo_cancha_id
    WHERE 1 = 1
  `;

  const valores = [];

  if (filtros.fecha_reserva) {
    sql += ' AND r.fecha_reserva = ?';
    valores.push(filtros.fecha_reserva);
  }

  if (filtros.cancha_id) {
    sql += ' AND r.cancha_id = ?';
    valores.push(filtros.cancha_id);
  }

  if (filtros.estado) {
    sql += ' AND r.estado = ?';
    valores.push(filtros.estado);
  }

  sql += ' ORDER BY r.fecha_reserva, r.hora_inicio';

  const [rows] = await pool.query(sql, valores);
  return rows;
}

async function obtenerPorId(id) {
  const [rows] = await pool.query(
    `SELECT
      r.id,
      DATE_FORMAT(r.fecha_reserva, '%Y-%m-%d') AS fecha_reserva,
      r.hora_inicio,
      r.hora_fin,
      r.estado,
      r.origen,
      r.recordatorio_enviado,
      r.fecha_creacion,
      r.cliente_id,
      cl.nombre AS cliente,
      cl.telefono AS telefono_cliente,
      r.cancha_id,
      ca.nombre AS cancha,
      ca.precio_por_hora,
      tc.nombre AS tipo_cancha
    FROM reserva r
    INNER JOIN cliente cl ON cl.id = r.cliente_id
    INNER JOIN cancha ca ON ca.id = r.cancha_id
    INNER JOIN tipo_cancha tc ON tc.id = ca.tipo_cancha_id
    WHERE r.id = ?`,
    [id]
  );

  return rows[0];
}

async function buscarCruceDeHorario(reservaId, reserva) {
  let sql = `
    SELECT id
    FROM reserva
    WHERE cancha_id = ?
      AND fecha_reserva = ?
      AND estado IN ('pendiente', 'confirmada')
      AND hora_inicio < ?
      AND hora_fin > ?
  `;

  const valores = [
    reserva.cancha_id,
    reserva.fecha_reserva,
    reserva.hora_fin,
    reserva.hora_inicio
  ];

  if (reservaId) {
    sql += ' AND id <> ?';
    valores.push(reservaId);
  }

  const [rows] = await pool.query(sql, valores);
  return rows[0];
}

async function crear(reserva) {
  const [result] = await pool.query(
    `INSERT INTO reserva
      (cliente_id, cancha_id, fecha_reserva, hora_inicio, hora_fin, estado, origen, recordatorio_enviado)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      reserva.cliente_id,
      reserva.cancha_id,
      reserva.fecha_reserva,
      reserva.hora_inicio,
      reserva.hora_fin,
      reserva.estado,
      reserva.origen,
      reserva.recordatorio_enviado
    ]
  );

  return result.insertId;
}

async function actualizar(id, reserva) {
  await pool.query(
    `UPDATE reserva
    SET cliente_id = ?,
      cancha_id = ?,
      fecha_reserva = ?,
      hora_inicio = ?,
      hora_fin = ?,
      estado = ?,
      origen = ?,
      recordatorio_enviado = ?
    WHERE id = ?`,
    [
      reserva.cliente_id,
      reserva.cancha_id,
      reserva.fecha_reserva,
      reserva.hora_inicio,
      reserva.hora_fin,
      reserva.estado,
      reserva.origen,
      reserva.recordatorio_enviado,
      id
    ]
  );
}

async function cambiarEstado(id, estado) {
  await pool.query(
    'UPDATE reserva SET estado = ? WHERE id = ?',
    [estado, id]
  );
}

module.exports = {
  listar,
  obtenerPorId,
  buscarCruceDeHorario,
  crear,
  actualizar,
  cambiarEstado
};
