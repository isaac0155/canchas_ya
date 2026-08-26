const router = require('express').Router();
const reservaController = require('../controllers/reserva.controller');

router.get('/', reservaController.listar);
router.get('/metricas/resumen', reservaController.metricas);
router.get('/:id', reservaController.obtenerPorId);
router.post('/', reservaController.crear);
router.put('/:id', reservaController.actualizar);
router.delete('/:id', reservaController.cancelar);
router.patch('/:id/asistio-pago', reservaController.marcarAsistioYPago);
router.patch('/:id/no-llego', reservaController.marcarNoLlego);

module.exports = router;
