const router = require('express').Router();
const canchaController = require('../controllers/cancha.controller');
const { validarCampos } = require('../middlewares/validacion.middleware');

const validarCancha = validarCampos([
  { campo: 'nombre', requerido: true, max: 100 },
  { campo: 'tipo_cancha_id', requerido: true, tipo: 'numero' },
  { campo: 'precio_por_hora', requerido: true, tipo: 'numero' }
]);

router.get('/', canchaController.listar);
router.get('/:id', canchaController.obtenerPorId);
router.post('/', validarCancha, canchaController.crear);
router.put('/:id', validarCancha, canchaController.actualizar);
router.delete('/:id', canchaController.desactivar);

module.exports = router;
