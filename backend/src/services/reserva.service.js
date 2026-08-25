const reservaRepository = require('../repositories/reserva.repository');
const clienteRepository = require('../repositories/cliente.repository');
const canchaRepository = require('../repositories/cancha.repository');
const horarioService = require('./horario.service');

async function listarReservas(filtros) {
  return reservaRepository.listar(filtros);
}

async function obtenerReservaPorId(id) {
  return reservaRepository.obtenerPorId(id);
}

async function crearReserva(datos) {
  const reserva = await prepararDatosReserva(datos);
  await horarioService.validarReservaEnHorario(reserva);
  await validarDisponibilidad(null, reserva);

  const id = await reservaRepository.crear(reserva);
  return reservaRepository.obtenerPorId(id);
}

async function validarReservaSinCrear(datos) {
  const reserva = await prepararDatosReserva(datos);
  await horarioService.validarReservaEnHorario(reserva);
  await validarDisponibilidad(null, reserva);
  return reserva;
}

async function actualizarReserva(id, datos) {
  const reservaActual = await reservaRepository.obtenerPorId(id);

  if (!reservaActual) {
    return null;
  }

  const reserva = await prepararDatosReserva(datos);
  await horarioService.validarReservaEnHorario(reserva);
  await validarDisponibilidad(id, reserva);

  await reservaRepository.actualizar(id, reserva);
  return reservaRepository.obtenerPorId(id);
}

async function cancelarReserva(id) {
  const reservaActual = await reservaRepository.obtenerPorId(id);

  if (!reservaActual) {
    return null;
  }

  await reservaRepository.cambiarEstado(id, 'cancelada');
  return true;
}

async function prepararDatosReserva(datos) {
  const clienteId = Number(datos.cliente_id);
  const canchaId = Number(datos.cancha_id);
  const fechaReserva = prepararFecha(datos.fecha_reserva);
  const horaInicio = prepararHora(datos.hora_inicio, 'La hora de inicio es obligatoria');
  const horaFin = prepararHora(datos.hora_fin, 'La hora de fin es obligatoria');
  const estado = datos.estado || 'pendiente';
  const origen = datos.origen || 'admin';

  if (!clienteId) {
    throw new Error('El cliente es obligatorio');
  }

  if (!canchaId) {
    throw new Error('La cancha es obligatoria');
  }

  if (horaInicio >= horaFin) {
    throw new Error('La hora de fin debe ser mayor a la hora de inicio');
  }

  validarBloqueDeMediaHora(horaInicio);
  validarBloqueDeMediaHora(horaFin);

  if (!['pendiente', 'confirmada', 'cancelada', 'finalizada'].includes(estado)) {
    throw new Error('El estado de la reserva no es valido');
  }

  if (!['whatsapp', 'admin'].includes(origen)) {
    throw new Error('El origen de la reserva no es valido');
  }

  const cliente = await clienteRepository.obtenerPorId(clienteId);

  if (!cliente || cliente.estado !== 'activo') {
    throw new Error('El cliente no existe o esta inactivo');
  }

  const cancha = await canchaRepository.obtenerPorId(canchaId);

  if (!cancha || cancha.estado !== 'activa') {
    throw new Error('La cancha no existe o no esta activa');
  }

  return {
    cliente_id: clienteId,
    cancha_id: canchaId,
    fecha_reserva: fechaReserva,
    hora_inicio: horaInicio,
    hora_fin: horaFin,
    estado,
    origen,
    recordatorio_enviado: Boolean(datos.recordatorio_enviado)
  };
}

async function validarDisponibilidad(reservaId, reserva) {
  if (['cancelada', 'finalizada'].includes(reserva.estado)) {
    return;
  }

  const reservaCruzada = await reservaRepository.buscarCruceDeHorario(reservaId, reserva);

  if (reservaCruzada) {
    throw new Error('La cancha ya tiene una reserva en ese horario');
  }
}

function prepararFecha(fecha) {
  if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    throw new Error('La fecha debe tener formato YYYY-MM-DD');
  }

  return fecha;
}

function prepararHora(hora, mensajeError) {
  if (!hora || hora.trim() === '') {
    throw new Error(mensajeError);
  }

  const horaNormalizada = hora.trim();

  if (!/^\d{2}:\d{2}(:\d{2})?$/.test(horaNormalizada)) {
    throw new Error('La hora debe tener formato HH:mm');
  }

  if (horaNormalizada.length === 5) {
    return `${horaNormalizada}:00`;
  }

  return horaNormalizada;
}

function validarBloqueDeMediaHora(hora) {
  const minutos = hora.slice(3, 5);

  if (!['00', '30'].includes(minutos)) {
    throw new Error('Las reservas solo pueden iniciar o terminar en horas exactas o medias horas');
  }
}

module.exports = {
  listarReservas,
  obtenerReservaPorId,
  crearReserva,
  validarReservaSinCrear,
  actualizarReserva,
  cancelarReserva
};
