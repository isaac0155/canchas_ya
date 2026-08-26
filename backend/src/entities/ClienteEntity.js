const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Cliente',
  tableName: 'cliente',
  columns: {
    id: { type: Number, primary: true, generated: true },
    nombre: { type: String },
    telefono: { type: String },
    estado: { type: String },
    fecha_registro: { type: 'datetime' }
  }
});
