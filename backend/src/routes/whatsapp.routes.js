const router = require('express').Router();
const whatsappController = require('../controllers/whatsapp.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/mensaje', whatsappController.recibirMensaje);
router.post('/iniciar', authMiddleware.verificarAdmin, whatsappController.iniciarReal);
router.get('/estado', authMiddleware.verificarAdmin, whatsappController.estadoReal);
router.post('/cerrar', authMiddleware.verificarAdmin, whatsappController.cerrarReal);

module.exports = router;
