const { dataSource } = require('../config/typeorm');

function repositorio() {
  return dataSource.getRepository('TipoCancha');
}

async function listarActivos() {
  return repositorio().find({
    where: { estado: 'activo' },
    order: { nombre: 'ASC' }
  });
}

async function obtenerPorId(id) {
  return repositorio().findOneBy({ id: Number(id) });
}

async function obtenerPorNombre(nombre) {
  return repositorio().findOneBy({ nombre });
}

async function crear(nombre) {
  const tipoCancha = repositorio().create({
    nombre,
    estado: 'activo'
  });
  const guardado = await repositorio().save(tipoCancha);
  return guardado.id;
}

async function actualizar(id, nombre) {
  await repositorio().update(Number(id), { nombre });
}

async function desactivar(id) {
  await repositorio().update(Number(id), { estado: 'inactivo' });
}

module.exports = {
  listarActivos,
  obtenerPorId,
  obtenerPorNombre,
  crear,
  actualizar,
  desactivar
};
