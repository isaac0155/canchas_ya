const { dataSource } = require('../config/typeorm');

function repositorio() {
  return dataSource.getRepository('Reserva');
}

function consultaBase() {
  return repositorio()
    .createQueryBuilder('reserva')
    .innerJoin('reserva.cliente', 'cliente')
    .innerJoin('reserva.cancha', 'cancha')
    .innerJoin('cancha.tipoCancha', 'tipo')
    .select([
      'reserva.id AS id',
      'DATE_FORMAT(reserva.fecha_reserva, "%Y-%m-%d") AS fecha_reserva',
      'reserva.hora_inicio AS hora_inicio',
      'reserva.hora_fin AS hora_fin',
      'reserva.estado AS estado',
      'reserva.origen AS origen',
      'reserva.recordatorio_enviado AS recordatorio_enviado',
      'reserva.cancelacion_motivo AS cancelacion_motivo',
      'reserva.resultado AS resultado',
      'reserva.fecha_resultado AS fecha_resultado',
      'reserva.fecha_creacion AS fecha_creacion',
      'reserva.cliente_id AS cliente_id',
      'cliente.nombre AS cliente',
      'cliente.telefono AS telefono_cliente',
      'reserva.cancha_id AS cancha_id',
      'cancha.nombre AS cancha',
      'cancha.precio_por_hora AS precio_por_hora',
      'tipo.nombre AS tipo_cancha'
    ]);
}

async function listar(filtros) {
  const consulta = consultaBase();

  if (filtros.fecha_reserva) {
    consulta.andWhere('reserva.fecha_reserva = :fecha', { fecha: filtros.fecha_reserva });
  }

  if (filtros.cancha_id) {
    consulta.andWhere('reserva.cancha_id = :canchaId', { canchaId: Number(filtros.cancha_id) });
  }

  if (filtros.estado) {
    consulta.andWhere('reserva.estado = :estado', { estado: filtros.estado });
  }

  return consulta
    .orderBy('reserva.fecha_reserva', 'ASC')
    .addOrderBy('reserva.hora_inicio', 'ASC')
    .getRawMany();
}

async function obtenerPorId(id) {
  return consultaBase()
    .where('reserva.id = :id', { id: Number(id) })
    .getRawOne();
}

async function buscarCruceDeHorario(reservaId, reserva) {
  const consulta = repositorio()
    .createQueryBuilder('reserva')
    .select('reserva.id', 'id')
    .where('reserva.cancha_id = :canchaId', { canchaId: reserva.cancha_id })
    .andWhere('reserva.fecha_reserva = :fecha', { fecha: reserva.fecha_reserva })
    .andWhere('reserva.estado IN (:...estados)', { estados: ['pendiente', 'confirmada'] })
    .andWhere('reserva.hora_inicio < :horaFin', { horaFin: reserva.hora_fin })
    .andWhere('reserva.hora_fin > :horaInicio', { horaInicio: reserva.hora_inicio });

  if (reservaId) {
    consulta.andWhere('reserva.id <> :id', { id: Number(reservaId) });
  }

  return consulta.getRawOne();
}

async function crear(reserva) {
  const nuevaReserva = repositorio().create(reserva);
  const guardada = await repositorio().save(nuevaReserva);
  return guardada.id;
}

async function actualizar(id, reserva) {
  await repositorio().update(Number(id), reserva);
}

async function cambiarEstado(id, estado) {
  await repositorio().update(Number(id), { estado });
}

async function cancelar(id, motivo) {
  await repositorio().update(Number(id), {
    estado: 'cancelada',
    cancelacion_motivo: motivo,
    resultado: 'sin_marcar'
  });
}

async function marcarResultado(id, resultado) {
  await repositorio().update(Number(id), {
    resultado,
    estado: 'finalizada',
    fecha_resultado: new Date()
  });
}

module.exports = {
  listar,
  obtenerPorId,
  buscarCruceDeHorario,
  crear,
  actualizar,
  cambiarEstado,
  cancelar,
  marcarResultado
};
