const { pool } = require('../config/database');

async function listarPendientes() {
  const [rows] = await pool.query(
    `SELECT
      r.id,
      DATE_FORMAT(r.fecha_reserva, '%Y-%m-%d') AS fecha_reserva,
      r.hora_inicio,
      r.hora_fin,
      cl.nombre AS cliente,
      cl.telefono AS telefono_cliente,
      ca.nombre AS cancha
    FROM reserva r
    INNER JOIN cliente cl ON cl.id = r.cliente_id
    INNER JOIN cancha ca ON ca.id = r.cancha_id
    WHERE r.estado = 'confirmada'
      AND r.recordatorio_enviado = FALSE
      AND TIMESTAMP(r.fecha_reserva, r.hora_inicio) BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 2 HOUR)
    ORDER BY r.fecha_reserva, r.hora_inicio`
  );

  return rows;
}

async function marcarComoEnviado(id) {
  await pool.query(
    'UPDATE reserva SET recordatorio_enviado = TRUE WHERE id = ?',
    [id]
  );
}

module.exports = {
  listarPendientes,
  marcarComoEnviado
};
