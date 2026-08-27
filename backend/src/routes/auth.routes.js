const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { limitadorLogin } = require('../middlewares/seguridad.middleware');
const { validarCampos } = require('../middlewares/validacion.middleware');

router.post('/login', limitadorLogin, validarCampos([
  { campo: 'email', requerido: true, tipo: 'email' },
  { campo: 'password', requerido: true }
]), authController.login);
router.post('/logout', authMiddleware.verificarAdmin, authController.logout);
router.get('/perfil', authMiddleware.verificarAdmin, authController.perfil);

module.exports = router;
