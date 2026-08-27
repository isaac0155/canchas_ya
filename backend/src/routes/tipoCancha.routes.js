const router = require('express').Router();
const tipoCanchaController = require('../controllers/tipoCancha.controller');
const { validarCampos } = require('../middlewares/validacion.middleware');

const validarTipoCancha = validarCampos([
  { campo: 'nombre', requerido: true, max: 80 }
]);

router.get('/', tipoCanchaController.listar);
router.get('/:id', tipoCanchaController.obtenerPorId);
router.post('/', validarTipoCancha, tipoCanchaController.crear);
router.put('/:id', validarTipoCancha, tipoCanchaController.actualizar);
router.delete('/:id', tipoCanchaController.desactivar);

module.exports = router;
