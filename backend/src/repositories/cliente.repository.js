const { dataSource } = require('../config/typeorm');

function repositorio() {
  return dataSource.getRepository('Cliente');
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

async function obtenerPorTelefono(telefono) {
  return repositorio().findOneBy({ telefono });
}

async function crear(cliente) {
  const nuevoCliente = repositorio().create(cliente);
  const guardado = await repositorio().save(nuevoCliente);
  return guardado.id;
}

async function actualizar(id, cliente) {
  await repositorio().update(Number(id), cliente);
}

async function desactivar(id) {
  await repositorio().update(Number(id), { estado: 'inactivo' });
}

module.exports = {
  listarActivos,
  obtenerPorId,
  obtenerPorTelefono,
  crear,
  actualizar,
  desactivar
};
