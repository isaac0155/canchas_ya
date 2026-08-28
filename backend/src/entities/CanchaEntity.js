const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Cancha',
  tableName: 'cancha',
  columns: {
    id: { type: Number, primary: true, generated: true },
    tipo_cancha_id: { type: Number },
    nombre: { type: String },
    precio_por_hora: { type: 'decimal', precision: 10, scale: 2 },
    estado: { type: String },
    fecha_creacion: { type: 'datetime' }
  },
  relations: {
    tipoCancha: {
      type: 'many-to-one',
      target: 'TipoCancha',
      inverseSide: 'canchas',
      joinColumn: {
        name: 'tipo_cancha_id'
      },
      createForeignKeyConstraints: true
    },
    reservas: {
      type: 'one-to-many',
      target: 'Reserva',
      inverseSide: 'cancha'
    }
  }
});
