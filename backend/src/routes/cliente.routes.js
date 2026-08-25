const router = require('express').Router();
const clienteController = require('../controllers/cliente.controller');

router.get('/', clienteController.listar);
router.get('/:id', clienteController.obtenerPorId);
router.post('/', clienteController.crear);
router.put('/:id', clienteController.actualizar);
router.delete('/:id', clienteController.desactivar);

module.exports = router;
