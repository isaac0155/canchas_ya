const canchaService = require('../services/cancha.service');

async function listar(req, res) {
  try {
    const canchas = await canchaService.listarCanchas();
    res.json(canchas);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al listar canchas'
    });
  }
}

async function obtenerPorId(req, res) {
  try {
    const cancha = await canchaService.obtenerCanchaPorId(req.params.id);

    if (!cancha) {
      return res.status(404).json({
        mensaje: 'Cancha no encontrada'
      });
    }

    res.json(cancha);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener cancha'
    });
  }
}

async function crear(req, res) {
  try {
    const nuevaCancha = await canchaService.crearCancha(req.body);
    res.status(201).json(nuevaCancha);
  } catch (error) {
    res.status(400).json({
      mensaje: error.message
    });
  }
}

async function actualizar(req, res) {
  try {
    const canchaActualizada = await canchaService.actualizarCancha(req.params.id, req.body);

    if (!canchaActualizada) {
      return res.status(404).json({
        mensaje: 'Cancha no encontrada'
      });
    }

    res.json(canchaActualizada);
  } catch (error) {
    res.status(400).json({
      mensaje: error.message
    });
  }
}

async function desactivar(req, res) {
  try {
    const canchaDesactivada = await canchaService.desactivarCancha(req.params.id);

    if (!canchaDesactivada) {
      return res.status(404).json({
        mensaje: 'Cancha no encontrada'
      });
    }

    res.json({
      mensaje: 'Cancha desactivada correctamente'
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
