const { dataSource } = require('../config/typeorm');

function repositorio() {
  return dataSource.getRepository('Administrador');
}

async function obtenerPorEmail(email) {
  return repositorio().findOne({
    where: { email },
    select: ['id', 'nombre', 'email', 'password_hash', 'estado']
  });
}

async function obtenerPorId(id) {
  return repositorio().findOne({
    where: { id: Number(id) },
    select: ['id', 'nombre', 'email', 'estado']
  });
}

async function crear(administrador) {
  const nuevoAdministrador = repositorio().create(administrador);
  const guardado = await repositorio().save(nuevoAdministrador);
  return guardado.id;
}

module.exports = {
  obtenerPorEmail,
  obtenerPorId,
  crear
};
