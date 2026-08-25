const router = require('express').Router();
const canchaController = require('../controllers/cancha.controller');

router.get('/', canchaController.listar);
router.get('/:id', canchaController.obtenerPorId);
router.post('/', canchaController.crear);
router.put('/:id', canchaController.actualizar);
router.delete('/:id', canchaController.desactivar);

module.exports = router;
