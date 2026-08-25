const recordatorioRepository = require('../repositories/recordatorio.repository');

async function listarPendientes() {
  return recordatorioRepository.listarPendientes();
}

async function procesarPendientes() {
  const recordatorios = await recordatorioRepository.listarPendientes();

  for (const recordatorio of recordatorios) {
    console.log(
      `Recordatorio para ${recordatorio.cliente}: reserva en ${recordatorio.cancha} a las ${recordatorio.hora_inicio}`
    );

    await recordatorioRepository.marcarComoEnviado(recordatorio.id);
  }

  return {
    mensaje: 'Recordatorios procesados correctamente',
    cantidad: recordatorios.length,
    recordatorios
  };
}

module.exports = {
  listarPendientes,
  procesarPendientes
};
