const tipoCanchaRepository = require('../repositories/tipoCancha.repository');

async function listarTipos() {
  return tipoCanchaRepository.listarActivos();
}

async function obtenerTipoPorId(id) {
  return tipoCanchaRepository.obtenerPorId(id);
}

async function crearTipo(datos) {
  const nombre = prepararNombre(datos.nombre);
  const tipoExistente = await tipoCanchaRepository.obtenerPorNombre(nombre);

  if (tipoExistente) {
    throw new Error('Ya existe un tipo de cancha con ese nombre');
  }

  const id = await tipoCanchaRepository.crear(nombre);
  return tipoCanchaRepository.obtenerPorId(id);
}

async function actualizarTipo(id, datos) {
  const tipoActual = await tipoCanchaRepository.obtenerPorId(id);

  if (!tipoActual) {
    return null;
  }

  const nombre = prepararNombre(datos.nombre);
  const tipoExistente = await tipoCanchaRepository.obtenerPorNombre(nombre);

  if (tipoExistente && tipoExistente.id !== Number(id)) {
    throw new Error('Ya existe un tipo de cancha con ese nombre');
  }

  await tipoCanchaRepository.actualizar(id, nombre);
  return tipoCanchaRepository.obtenerPorId(id);
}

async function desactivarTipo(id) {
  const tipoActual = await tipoCanchaRepository.obtenerPorId(id);

  if (!tipoActual) {
    return null;
  }

  await tipoCanchaRepository.desactivar(id);
  return true;
}

function prepararNombre(nombre) {
  if (!nombre || nombre.trim() === '') {
    throw new Error('El nombre es obligatorio');
  }

  return nombre.trim();
}

module.exports = {
  listarTipos,
  obtenerTipoPorId,
  crearTipo,
  actualizarTipo,
  desactivarTipo
};
