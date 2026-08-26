const { dataSource } = require('../config/typeorm');

function repositorioHorario() {
  return dataSource.getRepository('HorarioAtencion');
}

function repositorioFecha() {
  return dataSource.getRepository('FechaBloqueada');
}

async function listarHorarios() {
  return repositorioHorario().find({
    order: { dia_semana: 'ASC' }
  });
}

async function obtenerPorDia(diaSemana) {
  return repositorioHorario().findOneBy({ dia_semana: Number(diaSemana) });
}

async function actualizarHorario(diaSemana, horario) {
  await repositorioHorario().update(
    { dia_semana: Number(diaSemana) },
    {
      atiende: horario.atiende,
      hora_inicio: horario.hora_inicio,
      hora_fin: horario.hora_fin
    }
  );
}

async function listarFechasBloqueadas() {
  const fechas = await repositorioFecha().find({
    order: { fecha: 'ASC' }
  });

  return fechas.map(formatearFechaBloqueada);
}

async function obtenerFechaBloqueada(fecha) {
  const fechaBloqueada = await repositorioFecha().findOneBy({ fecha });

  if (!fechaBloqueada) {
    return null;
  }

  return formatearFechaBloqueada(fechaBloqueada);
}

async function crearFechaBloqueada(fecha, motivo) {
  const nuevaFecha = repositorioFecha().create({ fecha, motivo });
  const guardada = await repositorioFecha().save(nuevaFecha);
  return guardada.id;
}

async function eliminarFechaBloqueada(id) {
  await repositorioFecha().delete(Number(id));
}

function formatearFechaBloqueada(fechaBloqueada) {
  return {
    id: fechaBloqueada.id,
    fecha: String(fechaBloqueada.fecha).slice(0, 10),
    motivo: fechaBloqueada.motivo
  };
}

module.exports = {
  listarHorarios,
  obtenerPorDia,
  actualizarHorario,
  listarFechasBloqueadas,
  obtenerFechaBloqueada,
  crearFechaBloqueada,
  eliminarFechaBloqueada
};
