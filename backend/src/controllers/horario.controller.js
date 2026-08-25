const horarioService = require('../services/horario.service');

async function listar(req, res) {
  try {
    const configuracion = await horarioService.listarConfiguracion();
    res.json(configuracion);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al listar horarios'
    });
  }
}

async function actualizarHorario(req, res) {
  try {
    const horario = await horarioService.actualizarHorario(req.params.diaSemana, req.body);
    res.json(horario);
  } catch (error) {
    res.status(400).json({
      mensaje: error.message
    });
  }
}

async function bloquearFecha(req, res) {
  try {
    const fecha = await horarioService.bloquearFecha(req.body);
    res.status(201).json(fecha);
  } catch (error) {
    res.status(400).json({
      mensaje: error.message
    });
  }
}

async function eliminarFechaBloqueada(req, res) {
  try {
    await horarioService.eliminarFechaBloqueada(req.params.id);
    res.json({
      mensaje: 'Fecha desbloqueada correctamente'
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message
    });
  }
}

module.exports = {
  listar,
  actualizarHorario,
  bloquearFecha,
  eliminarFechaBloqueada
};
