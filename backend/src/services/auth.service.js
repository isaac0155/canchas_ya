const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const administradorRepository = require('../repositories/administrador.repository');

async function login(datos) {
  const email = prepararEmail(datos.email);
  const password = prepararPassword(datos.password);
  const administrador = await administradorRepository.obtenerPorEmail(email);

  if (!administrador || administrador.estado !== 'activo') {
    throw new Error('Credenciales incorrectas');
  }

  const passwordCorrecto = await bcrypt.compare(password, administrador.password_hash);

  if (!passwordCorrecto) {
    throw new Error('Credenciales incorrectas');
  }

  const datosAdmin = {
    id: administrador.id,
    nombre: administrador.nombre,
    email: administrador.email,
    rol: 'admin'
  };

  const token = jwt.sign(datosAdmin, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });

  return {
    token,
    administrador: datosAdmin
  };
}

function prepararEmail(email) {
  if (!email || email.trim() === '') {
    throw new Error('El email es obligatorio');
  }

  return email.trim().toLowerCase();
}

function prepararPassword(password) {
  if (!password || password.trim() === '') {
    throw new Error('La contrasena es obligatoria');
  }

  return password;
}

module.exports = {
  login
};
