const recordatorioService = require('../services/recordatorio.service');

async function listarPendientes(req, res) {
  try {
    const recordatorios = await recordatorioService.listarPendientes();
    res.json(recordatorios);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al listar recordatorios pendientes'
    });
  }
}

async function procesar(req, res) {
  try {
    const resultado = await recordatorioService.procesarPendientes();
    res.json(resultado);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al procesar recordatorios'
    });
  }
}

module.exports = {
  listarPendientes,
  procesar
};
