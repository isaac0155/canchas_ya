const jwt = require('jsonwebtoken');
const env = require('../config/env');
const administradorRepository = require('../repositories/administrador.repository');

async function verificarAdmin(req, res, next) {
  try {
    const token = req.cookies.token_admin;

    if (!token) {
      return res.status(401).json({
        mensaje: 'No autenticado'
      });
    }

    const datosToken = jwt.verify(token, env.jwtSecret);
    const administrador = await administradorRepository.obtenerPorId(datosToken.id);

    if (!administrador || administrador.estado !== 'activo') {
      return res.status(401).json({
        mensaje: 'No autenticado'
      });
    }

    req.administrador = administrador;
    next();
  } catch (error) {
    res.status(401).json({
      mensaje: 'No autenticado'
    });
  }
}

module.exports = {
  verificarAdmin
};
