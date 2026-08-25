const router = require('express').Router();
const tipoCanchaController = require('../controllers/tipoCancha.controller');

router.get('/', tipoCanchaController.listar);
router.get('/:id', tipoCanchaController.obtenerPorId);
router.post('/', tipoCanchaController.crear);
router.put('/:id', tipoCanchaController.actualizar);
router.delete('/:id', tipoCanchaController.desactivar);

module.exports = router;
