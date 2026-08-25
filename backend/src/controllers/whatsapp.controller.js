const whatsappService = require('../services/whatsapp.service');
const whatsappRealService = require('../services/whatsappReal.service');

async function recibirMensaje(req, res) {
  try {
    const respuesta = await whatsappService.procesarMensaje(req.body);
    res.json(respuesta);
  } catch (error) {
    res.status(400).json({
      mensaje: error.message
    });
  }
}

async function iniciarReal(req, res) {
  try {
    const estado = await whatsappRealService.iniciar();
    res.json(estado);
  } catch (error) {
    res.status(500).json({
      mensaje: 'No se pudo iniciar WhatsApp',
      detalle: error.message
    });
  }
}

async function estadoReal(req, res) {
  res.json(whatsappRealService.obtenerEstado());
}

async function cerrarReal(req, res) {
  try {
    const estado = await whatsappRealService.cerrar();
    res.json(estado);
  } catch (error) {
    res.status(500).json({
      mensaje: 'No se pudo cerrar WhatsApp',
      detalle: error.message
    });
  }
}

module.exports = {
  recibirMensaje,
  iniciarReal,
  estadoReal,
  cerrarReal
};
