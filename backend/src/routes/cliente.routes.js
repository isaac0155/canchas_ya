const router = require('express').Router();
const clienteController = require('../controllers/cliente.controller');
const { validarCampos } = require('../middlewares/validacion.middleware');

const validarCliente = validarCampos([
  { campo: 'nombre', requerido: true, max: 100 },
  { campo: 'telefono', requerido: true, max: 20 }
]);

router.get('/', clienteController.listar);
router.get('/:id', clienteController.obtenerPorId);
router.post('/', validarCliente, clienteController.crear);
router.put('/:id', validarCliente, clienteController.actualizar);
router.delete('/:id', clienteController.desactivar);

module.exports = router;
