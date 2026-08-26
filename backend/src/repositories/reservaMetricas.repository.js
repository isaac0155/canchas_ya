const { dataSource } = require('../config/typeorm');

async function obtenerMetricas() {
  const repositorio = dataSource.getRepository('Reserva');

  const [total, confirmadas, canceladas, finalizadas, asistieronYPagaron, noLlegaron] = await Promise.all([
    repositorio.count(),
    repositorio.count({ where: { estado: 'confirmada' } }),
    repositorio.count({ where: { estado: 'cancelada' } }),
    repositorio.count({ where: { estado: 'finalizada' } }),
    repositorio.count({ where: { resultado: 'asistio_pago' } }),
    repositorio.count({ where: { resultado: 'no_llego' } })
  ]);

  return {
    total,
    confirmadas,
    canceladas,
    finalizadas,
    asistieronYPagaron,
    noLlegaron
  };
}

module.exports = {
  obtenerMetricas
};
