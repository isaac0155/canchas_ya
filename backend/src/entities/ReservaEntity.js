const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Reserva',
  tableName: 'reserva',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true
    },
    cliente_id: {
      type: Number
    },
    cancha_id: {
      type: Number
    },
    fecha_reserva: {
      type: 'date'
    },
    hora_inicio: {
      type: 'time'
    },
    hora_fin: {
      type: 'time'
    },
    estado: {
      type: String
    },
    origen: {
      type: String
    },
    recordatorio_enviado: {
      type: Boolean
    },
    cancelacion_motivo: {
      type: String,
      nullable: true
    },
    resultado: {
      type: String
    },
    fecha_resultado: {
      type: 'datetime',
      nullable: true
    },
    fecha_creacion: {
      type: 'datetime'
    }
  }
});
