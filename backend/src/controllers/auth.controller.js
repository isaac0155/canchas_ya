const authService = require('../services/auth.service');

async function login(req, res) {
  try {
    const resultado = await authService.login(req.body);

    res.cookie('token_admin', resultado.token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
      mensaje: 'Login correcto',
      administrador: resultado.administrador
    });
  } catch (error) {
    res.status(401).json({
      mensaje: error.message
    });
  }
}

function logout(req, res) {
  res.clearCookie('token_admin');
  res.json({
    mensaje: 'Sesion cerrada correctamente'
  });
}

function perfil(req, res) {
  res.json({
    administrador: req.administrador
  });
}

module.exports = {
  login,
  logout,
  perfil
};
