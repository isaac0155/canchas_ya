const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'TipoCancha',
  tableName: 'tipo_cancha',
  columns: {
    id: { type: Number, primary: true, generated: true },
    nombre: { type: String },
    estado: { type: String },
    fecha_creacion: { type: 'datetime' }
  }
});
