const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'FechaBloqueada',
  tableName: 'fecha_bloqueada',
  columns: {
    id: { type: Number, primary: true, generated: true },
    fecha: { type: 'date' },
    motivo: { type: String, nullable: true },
    fecha_creacion: { type: 'datetime' }
  }
});
