const router = require('express').Router();
const authRoutes = require('./auth.routes');
const tipoCanchaRoutes = require('./tipoCancha.routes');
const canchaRoutes = require('./cancha.routes');
const clienteRoutes = require('./cliente.routes');
const reservaRoutes = require('./reserva.routes');
const recordatorioRoutes = require('./recordatorio.routes');
const whatsappRoutes = require('./whatsapp.routes');
const horarioRoutes = require('./horario.routes');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/salud', (req, res) => {
  res.json({
    mensaje: 'API de CanchaYa funcionando'
  });
});

router.use('/auth', authRoutes);
router.use('/whatsapp', whatsappRoutes);
router.use('/tipos-cancha', authMiddleware.verificarAdmin, tipoCanchaRoutes);
router.use('/canchas', authMiddleware.verificarAdmin, canchaRoutes);
router.use('/clientes', authMiddleware.verificarAdmin, clienteRoutes);
router.use('/reservas', authMiddleware.verificarAdmin, reservaRoutes);
router.use('/recordatorios', authMiddleware.verificarAdmin, recordatorioRoutes);
router.use('/horarios', authMiddleware.verificarAdmin, horarioRoutes);

module.exports = router;
