const router = require('express').Router();
const reservaController = require('../controllers/reserva.controller');
const { validarCampos } = require('../middlewares/validacion.middleware');

const validarReserva = validarCampos([
  { campo: 'cliente_id', requerido: true, tipo: 'numero' },
  { campo: 'cancha_id', requerido: true, tipo: 'numero' },
  { campo: 'fecha_reserva', requerido: true, tipo: 'fecha' },
  { campo: 'hora_inicio', requerido: true, tipo: 'hora' },
  { campo: 'hora_fin', requerido: true, tipo: 'hora' }
]);

const validarCancelacion = validarCampos([
  { campo: 'motivo', requerido: true, max: 200 }
]);

router.get('/metricas/resumen', reservaController.metricas);
router.get('/', reservaController.listar);
router.get('/:id', reservaController.obtenerPorId);
router.post('/', validarReserva, reservaController.crear);
router.put('/:id', validarReserva, reservaController.actualizar);
router.delete('/:id', validarCancelacion, reservaController.cancelar);
router.patch('/:id/asistio-pago', reservaController.marcarAsistioYPago);
router.patch('/:id/no-llego', reservaController.marcarNoLlego);

module.exports = router;
