function validarCampos(reglas) {
  return (req, res, next) => {
    const errores = [];

    for (const regla of reglas) {
      const valor = req.body[regla.campo];

      if (regla.requerido && estaVacio(valor)) {
        errores.push(`${regla.campo} es obligatorio`);
        continue;
      }

      if (estaVacio(valor)) {
        continue;
      }

      if (regla.tipo === 'numero' && Number.isNaN(Number(valor))) {
        errores.push(`${regla.campo} debe ser numerico`);
      }

      if (regla.tipo === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(valor))) {
        errores.push(`${regla.campo} debe ser un email valido`);
      }

      if (regla.tipo === 'fecha' && !/^\d{4}-\d{2}-\d{2}$/.test(String(valor))) {
        errores.push(`${regla.campo} debe tener formato YYYY-MM-DD`);
      }

      if (regla.tipo === 'hora' && !/^\d{2}:\d{2}(:\d{2})?$/.test(String(valor))) {
        errores.push(`${regla.campo} debe tener formato HH:mm`);
      }

      if (regla.max && String(valor).length > regla.max) {
        errores.push(`${regla.campo} no debe pasar de ${regla.max} caracteres`);
      }
    }

    if (errores.length > 0) {
      return res.status(400).json({
        mensaje: 'Datos invalidos',
        errores
      });
    }

    next();
  };
}

function estaVacio(valor) {
  return valor === undefined || valor === null || String(valor).trim() === '';
}

module.exports = {
  validarCampos
};
