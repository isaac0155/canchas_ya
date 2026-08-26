const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'HorarioAtencion',
  tableName: 'horario_atencion',
  columns: {
    id: { type: Number, primary: true, generated: true },
    dia_semana: { type: Number },
    atiende: { type: Boolean },
    hora_inicio: { type: 'time' },
    hora_fin: { type: 'time' }
  }
});
