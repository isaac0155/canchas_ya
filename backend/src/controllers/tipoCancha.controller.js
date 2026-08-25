const tipoCanchaService = require('../services/tipoCancha.service');

async function listar(req, res) {
  try {
    const tipos = await tipoCanchaService.listarTipos();
    res.json(tipos);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al listar tipos de cancha'
    });
  }
}

async function obtenerPorId(req, res) {
  try {
    const tipo = await tipoCanchaService.obtenerTipoPorId(req.params.id);

    if (!tipo) {
      return res.status(404).json({
        mensaje: 'Tipo de cancha no encontrado'
      });
    }

    res.json(tipo);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener tipo de cancha'
    });
  }
}

async function crear(req, res) {
  try {
    const nuevoTipo = await tipoCanchaService.crearTipo(req.body);
    res.status(201).json(nuevoTipo);
  } catch (error) {
    res.status(400).json({
      mensaje: error.message
    });
  }
}

async function actualizar(req, res) {
  try {
    const tipoActualizado = await tipoCanchaService.actualizarTipo(req.params.id, req.body);

    if (!tipoActualizado) {
      return res.status(404).json({
        mensaje: 'Tipo de cancha no encontrado'
      });
    }

    res.json(tipoActualizado);
  } catch (error) {
    res.status(400).json({
      mensaje: error.message
    });
  }
}

async function desactivar(req, res) {
  try {
    const tipoDesactivado = await tipoCanchaService.desactivarTipo(req.params.id);

    if (!tipoDesactivado) {
      return res.status(404).json({
        mensaje: 'Tipo de cancha no encontrado'
      });
    }

    res.json({
      mensaje: 'Tipo de cancha desactivado correctamente'
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message
    });
  }
}

module.exports = {
  listar,
  obtenerPorId,
  crear,
  actualizar,
  desactivar
};
