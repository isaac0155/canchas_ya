const router = require('express').Router();
const recordatorioController = require('../controllers/recordatorio.controller');

router.get('/pendientes', recordatorioController.listarPendientes);
router.post('/procesar', recordatorioController.procesar);

module.exports = router;
