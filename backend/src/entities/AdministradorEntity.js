const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Administrador',
  tableName: 'administrador',
  columns: {
    id: { type: Number, primary: true, generated: true },
    nombre: { type: String },
    email: { type: String },
    password_hash: { type: String },
    estado: { type: String },
    fecha_creacion: { type: 'datetime' }
  }
});
