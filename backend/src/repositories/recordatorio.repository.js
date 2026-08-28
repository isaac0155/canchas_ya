const { dataSource } = require('../config/typeorm');

function repositorioReserva() {
  return dataSource.getRepository('Reserva');
}

async function listarPendientes() {
  return repositorioReserva()
    .createQueryBuilder('reserva')
    .innerJoin('reserva.cliente', 'cliente')
    .innerJoin('reserva.cancha', 'cancha')
    .select([
      'reserva.id AS id',
      'DATE_FORMAT(reserva.fecha_reserva, "%Y-%m-%d") AS fecha_reserva',
      'reserva.hora_inicio AS hora_inicio',
      'reserva.hora_fin AS hora_fin',
      'cliente.nombre AS cliente',
      'cliente.telefono AS telefono_cliente',
      'cancha.nombre AS cancha'
    ])
    .where('reserva.estado = :estado', { estado: 'confirmada' })
    .andWhere('reserva.recordatorio_enviado = :enviado', { enviado: false })
    .andWhere('TIMESTAMP(reserva.fecha_reserva, reserva.hora_inicio) BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 2 HOUR)')
    .orderBy('reserva.fecha_reserva', 'ASC')
    .addOrderBy('reserva.hora_inicio', 'ASC')
    .getRawMany();
}

async function marcarComoEnviado(id) {
  await repositorioReserva().update(Number(id), {
    recordatorio_enviado: true
  });
}

module.exports = {
  listarPendientes,
  marcarComoEnviado
};
