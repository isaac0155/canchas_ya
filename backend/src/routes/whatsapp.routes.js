const router = require('express').Router();
const whatsappController = require('../controllers/whatsapp.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { validarCampos } = require('../middlewares/validacion.middleware');

router.post('/mensaje', validarCampos([
  { campo: 'telefono', requerido: true, max: 20 },
  { campo: 'nombre', max: 100 },
  { campo: 'mensaje', requerido: true, max: 500 }
]), whatsappController.recibirMensaje);
router.post('/iniciar', authMiddleware.verificarAdmin, whatsappController.iniciarReal);
router.get('/estado', authMiddleware.verificarAdmin, whatsappController.estadoReal);
router.post('/cerrar', authMiddleware.verificarAdmin, whatsappController.cerrarReal);

module.exports = router;
