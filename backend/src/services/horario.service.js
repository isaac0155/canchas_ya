const horarioRepository = require('../repositories/horario.repository');

async function listarConfiguracion() {
  const horarios = await horarioRepository.listarHorarios();
  const fechasBloqueadas = await horarioRepository.listarFechasBloqueadas();

  return {
    horarios,
    fechasBloqueadas
  };
}

async function actualizarHorario(diaSemana, datos) {
  const dia = Number(diaSemana);
  const atiende = Boolean(datos.atiende);
  const horaInicio = prepararHora(datos.hora_inicio, 'La hora de inicio es obligatoria');
  const horaFin = prepararHora(datos.hora_fin, 'La hora de fin es obligatoria');

  if (dia < 0 || dia > 6) {
    throw new Error('El dia de semana no es valido');
  }

  if (horaInicio >= horaFin) {
    throw new Error('La hora de fin debe ser mayor a la hora de inicio');
  }

  await horarioRepository.actualizarHorario(dia, {
    atiende,
    hora_inicio: horaInicio,
    hora_fin: horaFin
  });

  return horarioRepository.obtenerPorDia(dia);
}

async function bloquearFecha(datos) {
  const fecha = prepararFecha(datos.fecha);
  const motivo = datos.motivo ? datos.motivo.trim() : null;
  const fechaExistente = await horarioRepository.obtenerFechaBloqueada(fecha);

  if (fechaExistente) {
    throw new Error('La fecha ya esta bloqueada');
  }

  const id = await horarioRepository.crearFechaBloqueada(fecha, motivo);
  return {
    id,
    fecha,
    motivo
  };
}

async function eliminarFechaBloqueada(id) {
  await horarioRepository.eliminarFechaBloqueada(id);
}

async function validarReservaEnHorario(reserva) {
  const fechaBloqueada = await horarioRepository.obtenerFechaBloqueada(reserva.fecha_reserva);

  if (fechaBloqueada) {
    throw new Error('No se atiende en esa fecha');
  }

  const diaSemana = obtenerDiaSemana(reserva.fecha_reserva);
  const horario = await horarioRepository.obtenerPorDia(diaSemana);

  if (!horario || !horario.atiende) {
    throw new Error('No se atiende ese dia de la semana');
  }

  if (reserva.hora_inicio < horario.hora_inicio || reserva.hora_fin > horario.hora_fin) {
    throw new Error(`La reserva debe estar entre ${horario.hora_inicio} y ${horario.hora_fin}`);
  }
}

function obtenerDiaSemana(fecha) {
  const fechaLocal = new Date(`${fecha}T00:00:00`);
  return fechaLocal.getDay();
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

module.exports = {
  listarConfiguracion,
  actualizarHorario,
  bloquearFecha,
  eliminarFechaBloqueada,
  validarReservaEnHorario
};
