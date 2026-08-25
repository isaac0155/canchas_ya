const clienteService = require('../services/cliente.service');

async function listar(req, res) {
  try {
    const clientes = await clienteService.listarClientes();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al listar clientes'
    });
  }
}

async function obtenerPorId(req, res) {
  try {
    const cliente = await clienteService.obtenerClientePorId(req.params.id);

    if (!cliente) {
      return res.status(404).json({
        mensaje: 'Cliente no encontrado'
      });
    }

    res.json(cliente);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener cliente'
    });
  }
}

async function crear(req, res) {
  try {
    const nuevoCliente = await clienteService.crearCliente(req.body);
    res.status(201).json(nuevoCliente);
  } catch (error) {
    res.status(400).json({
      mensaje: error.message
    });
  }
}

async function actualizar(req, res) {
  try {
    const clienteActualizado = await clienteService.actualizarCliente(req.params.id, req.body);

    if (!clienteActualizado) {
      return res.status(404).json({
        mensaje: 'Cliente no encontrado'
      });
    }

    res.json(clienteActualizado);
  } catch (error) {
    res.status(400).json({
      mensaje: error.message
    });
  }
}

async function desactivar(req, res) {
  try {
    const clienteDesactivado = await clienteService.desactivarCliente(req.params.id);

    if (!clienteDesactivado) {
      return res.status(404).json({
        mensaje: 'Cliente no encontrado'
      });
    }

    res.json({
      mensaje: 'Cliente desactivado correctamente'
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
