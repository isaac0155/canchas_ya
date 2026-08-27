const router = require('express').Router();
const horarioController = require('../controllers/horario.controller');
const { validarCampos } = require('../middlewares/validacion.middleware');

const validarHorario = validarCampos([
  { campo: 'hora_inicio', requerido: true, tipo: 'hora' },
  { campo: 'hora_fin', requerido: true, tipo: 'hora' }
]);

const validarFechaBloqueada = validarCampos([
  { campo: 'fecha', requerido: true, tipo: 'fecha' },
  { campo: 'motivo', max: 150 }
]);

router.get('/', horarioController.listar);
router.put('/:diaSemana', validarHorario, horarioController.actualizarHorario);
router.post('/fechas-bloqueadas', validarFechaBloqueada, horarioController.bloquearFecha);
router.delete('/fechas-bloqueadas/:id', horarioController.eliminarFechaBloqueada);

module.exports = router;
