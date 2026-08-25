const canchaRepository = require('../repositories/cancha.repository');
const tipoCanchaRepository = require('../repositories/tipoCancha.repository');

async function listarCanchas() {
  return canchaRepository.listarActivas();
}

async function obtenerCanchaPorId(id) {
  return canchaRepository.obtenerPorId(id);
}

async function crearCancha(datos) {
  const cancha = await prepararDatosCancha(datos);
  const canchaExistente = await canchaRepository.obtenerPorNombre(cancha.nombre);

  if (canchaExistente) {
    throw new Error('Ya existe una cancha con ese nombre');
  }

  const id = await canchaRepository.crear(cancha);
  return canchaRepository.obtenerPorId(id);
}

async function actualizarCancha(id, datos) {
  const canchaActual = await canchaRepository.obtenerPorId(id);

  if (!canchaActual) {
    return null;
  }

  const cancha = await prepararDatosCancha(datos);
  const canchaExistente = await canchaRepository.obtenerPorNombre(cancha.nombre);

  if (canchaExistente && canchaExistente.id !== Number(id)) {
    throw new Error('Ya existe una cancha con ese nombre');
  }

  await canchaRepository.actualizar(id, cancha);
  return canchaRepository.obtenerPorId(id);
}

async function desactivarCancha(id) {
  const canchaActual = await canchaRepository.obtenerPorId(id);

  if (!canchaActual) {
    return null;
  }

  await canchaRepository.desactivar(id);
  return true;
}

async function prepararDatosCancha(datos) {
  const nombre = prepararTexto(datos.nombre, 'El nombre es obligatorio');
  const estado = datos.estado || 'activa';
  const tipoCanchaId = Number(datos.tipo_cancha_id);
  const precioPorHora = Number(datos.precio_por_hora);

  if (!tipoCanchaId) {
    throw new Error('El tipo de cancha es obligatorio');
  }

  const tipoCancha = await tipoCanchaRepository.obtenerPorId(tipoCanchaId);

  if (!tipoCancha || tipoCancha.estado !== 'activo') {
    throw new Error('El tipo de cancha no existe o esta inactivo');
  }

  if (Number.isNaN(precioPorHora) || precioPorHora < 0) {
    throw new Error('El precio por hora debe ser mayor o igual a cero');
  }

  if (!['activa', 'inactiva', 'mantenimiento'].includes(estado)) {
    throw new Error('El estado de la cancha no es valido');
  }

  return {
    nombre,
    tipo_cancha_id: tipoCanchaId,
    precio_por_hora: precioPorHora,
    estado
  };
}

function prepararTexto(valor, mensajeError) {
  if (!valor || valor.trim() === '') {
    throw new Error(mensajeError);
  }

  return valor.trim();
}

module.exports = {
  listarCanchas,
  obtenerCanchaPorId,
  crearCancha,
  actualizarCancha,
  desactivarCancha
};
