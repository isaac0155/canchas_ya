const { dataSource } = require('../config/typeorm');

function repositorio() {
  return dataSource.getRepository('Cancha');
}

function consultaConTipo() {
  return repositorio()
    .createQueryBuilder('cancha')
    .innerJoin('tipo_cancha', 'tipo', 'tipo.id = cancha.tipo_cancha_id')
    .select([
      'cancha.id AS id',
      'cancha.nombre AS nombre',
      'cancha.precio_por_hora AS precio_por_hora',
      'cancha.estado AS estado',
      'cancha.tipo_cancha_id AS tipo_cancha_id',
      'tipo.nombre AS tipo_cancha'
    ]);
}

async function listarActivas() {
  return consultaConTipo()
    .where('cancha.estado <> :estado', { estado: 'inactiva' })
    .orderBy('cancha.nombre', 'ASC')
    .getRawMany();
}

async function obtenerPorId(id) {
  return consultaConTipo()
    .where('cancha.id = :id', { id: Number(id) })
    .getRawOne();
}

async function obtenerPorNombre(nombre) {
  return repositorio().findOne({
    where: { nombre },
    select: ['id', 'nombre', 'estado']
  });
}

async function crear(cancha) {
  const nuevaCancha = repositorio().create(cancha);
  const guardada = await repositorio().save(nuevaCancha);
  return guardada.id;
}

async function actualizar(id, cancha) {
  await repositorio().update(Number(id), cancha);
}

async function desactivar(id) {
  await repositorio().update(Number(id), { estado: 'inactiva' });
}

module.exports = {
  listarActivas,
  obtenerPorId,
  obtenerPorNombre,
  crear,
  actualizar,
  desactivar
};
