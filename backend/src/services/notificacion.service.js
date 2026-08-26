const whatsappRealService = require('./whatsappReal.service');

async function notificarCancelacion(reserva) {
  const mensaje = `Tu reserva fue cancelada.\nCancha: ${reserva.cancha}\nFecha: ${reserva.fecha_reserva}\nHorario: ${reserva.hora_inicio} a ${reserva.hora_fin}\nMotivo: ${reserva.cancelacion_motivo}`;
  return whatsappRealService.enviarMensaje(reserva.telefono_cliente, mensaje);
}

async function notificarRecordatorio(recordatorio) {
  const mensaje = `Recordatorio CanchaYa: tienes una reserva en 2 horas.\nCancha: ${recordatorio.cancha}\nFecha: ${recordatorio.fecha_reserva}\nHorario: ${recordatorio.hora_inicio} a ${recordatorio.hora_fin}`;
  return whatsappRealService.enviarMensaje(recordatorio.telefono_cliente, mensaje);
}

module.exports = {
  notificarCancelacion,
  notificarRecordatorio
};
