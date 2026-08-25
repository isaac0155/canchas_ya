const router = require('express').Router();
const reservaController = require('../controllers/reserva.controller');

router.get('/', reservaController.listar);
router.get('/:id', reservaController.obtenerPorId);
router.post('/', reservaController.crear);
router.put('/:id', reservaController.actualizar);
router.delete('/:id', reservaController.cancelar);

module.exports = router;
