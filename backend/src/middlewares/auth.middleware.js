const jwt = require('jsonwebtoken');
const env = require('../config/env');
const administradorRepository = require('../repositories/administrador.repository');

async function verificarAdmin(req, res, next) {
  try {
    const token = obtenerToken(req);

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
    req.administrador.rol = 'admin';
    next();
  } catch (error) {
    res.status(401).json({
      mensaje: 'No autenticado'
    });
  }
}

function obtenerToken(req) {
  if (req.cookies.token_admin) {
    return req.cookies.token_admin;
  }

  const authorization = req.headers.authorization;

  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '').trim();
  }

  return null;
}

function verificarRol(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.administrador || !rolesPermitidos.includes(req.administrador.rol)) {
      return res.status(403).json({
        mensaje: 'No autorizado'
      });
    }

    next();
  };
}

module.exports = {
  verificarAdmin,
  verificarRol
};
