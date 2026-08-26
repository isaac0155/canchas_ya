const recordatorioRepository = require('../repositories/recordatorio.repository');
const notificacionService = require('./notificacion.service');

async function listarPendientes() {
  return recordatorioRepository.listarPendientes();
}

async function procesarPendientes() {
  const recordatorios = await recordatorioRepository.listarPendientes();

  for (const recordatorio of recordatorios) {
    await notificacionService.notificarRecordatorio(recordatorio);
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
