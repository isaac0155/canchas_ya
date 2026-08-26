const reservaService = require('../services/reserva.service');
const notificacionService = require('../services/notificacion.service');

async function listar(req, res) {
  try {
    const reservas = await reservaService.listarReservas(req.query);
    res.json(reservas);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al listar reservas'
    });
  }
}

async function obtenerPorId(req, res) {
  try {
    const reserva = await reservaService.obtenerReservaPorId(req.params.id);

    if (!reserva) {
      return res.status(404).json({
        mensaje: 'Reserva no encontrada'
      });
    }

    res.json(reserva);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener reserva'
    });
  }
}

async function metricas(req, res) {
  try {
    const metricasReserva = await reservaService.obtenerMetricas();
    res.json(metricasReserva);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener metricas'
    });
  }
}

async function crear(req, res) {
  try {
    const nuevaReserva = await reservaService.crearReserva(req.body);
    res.status(201).json(nuevaReserva);
  } catch (error) {
    res.status(400).json({
      mensaje: error.message
    });
  }
}

async function actualizar(req, res) {
  try {
    const reservaActualizada = await reservaService.actualizarReserva(req.params.id, req.body);

    if (!reservaActualizada) {
      return res.status(404).json({
        mensaje: 'Reserva no encontrada'
      });
    }

    res.json(reservaActualizada);
  } catch (error) {
    res.status(400).json({
      mensaje: error.message
    });
  }
}

async function cancelar(req, res) {
  try {
    const reservaCancelada = await reservaService.cancelarReserva(req.params.id, req.body.motivo);

    if (!reservaCancelada) {
      return res.status(404).json({
        mensaje: 'Reserva no encontrada'
      });
    }

    await notificacionService.notificarCancelacion(reservaCancelada);

    res.json({
      mensaje: 'Reserva cancelada correctamente',
      reserva: reservaCancelada
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message
    });
  }
}

async function marcarAsistioYPago(req, res) {
  try {
    const reserva = await reservaService.marcarAsistioYPago(req.params.id);

    if (!reserva) {
      return res.status(404).json({
        mensaje: 'Reserva no encontrada'
      });
    }

    res.json(reserva);
  } catch (error) {
    res.status(400).json({
      mensaje: error.message
    });
  }
}

async function marcarNoLlego(req, res) {
  try {
    const reserva = await reservaService.marcarNoLlego(req.params.id);

    if (!reserva) {
      return res.status(404).json({
        mensaje: 'Reserva no encontrada'
      });
    }

    res.json(reserva);
  } catch (error) {
    res.status(400).json({
      mensaje: error.message
    });
  }
}

module.exports = {
  listar,
  obtenerPorId,
  metricas,
  crear,
  actualizar,
  cancelar,
  marcarAsistioYPago,
  marcarNoLlego
};
