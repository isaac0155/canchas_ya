const router = require('express').Router();
const horarioController = require('../controllers/horario.controller');

router.get('/', horarioController.listar);
router.put('/:diaSemana', horarioController.actualizarHorario);
router.post('/fechas-bloqueadas', horarioController.bloquearFecha);
router.delete('/fechas-bloqueadas/:id', horarioController.eliminarFechaBloqueada);

module.exports = router;
