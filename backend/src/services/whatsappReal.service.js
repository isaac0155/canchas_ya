const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const whatsappService = require('./whatsapp.service');

let clienteWhatsapp = null;
let qrActual = null;
let estado = 'desconectado';
let fechaInicioServicio = null;

async function iniciar() {
  if (clienteWhatsapp) {
    return obtenerEstado();
  }

  estado = 'iniciando';
  fechaInicioServicio = new Date();

  clienteWhatsapp = new Client({
    authStrategy: new LocalAuth({
      clientId: 'canchaya'
    }),
    puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  });

  clienteWhatsapp.on('qr', async (qr) => {
    qrActual = await qrcode.toDataURL(qr);
    estado = 'esperando_qr';
  });

  clienteWhatsapp.on('ready', () => {
    qrActual = null;
    estado = 'conectado';
  });

  clienteWhatsapp.on('disconnected', () => {
    estado = 'desconectado';
    qrActual = null;
    clienteWhatsapp = null;
  });

  clienteWhatsapp.on('message', async (mensaje) => {
    await atenderMensaje(mensaje);
  });

  await clienteWhatsapp.initialize();
  return obtenerEstado();
}

async function atenderMensaje(mensaje) {
  if (debeIgnorarMensaje(mensaje)) {
    return;
  }

  if (mensaje.from.endsWith('@g.us')) {
    return;
  }

  const telefono = mensaje.from.replace('@c.us', '');
  const contacto = await mensaje.getContact();

  try {
    const resultado = await whatsappService.procesarMensaje({
      telefono,
      nombre: contacto.pushname || '',
      mensaje: mensaje.body
    });

    await mensaje.reply(resultado.respuesta);
  } catch (error) {
    await mensaje.reply(error.message);
  }
}

function debeIgnorarMensaje(mensaje) {
  if (mensaje.fromMe) {
    return true;
  }

  if (!mensaje.body || mensaje.body.trim() === '') {
    return true;
  }

  const fechaMensaje = obtenerFechaMensaje(mensaje);

  if (!fechaMensaje) {
    return true;
  }

  if (fechaInicioServicio && fechaMensaje < fechaInicioServicio) {
    return true;
  }

  return !esDeHoy(fechaMensaje);
}

function obtenerFechaMensaje(mensaje) {
  if (!mensaje.timestamp) {
    return null;
  }

  return new Date(mensaje.timestamp * 1000);
}

function esDeHoy(fecha) {
  const hoy = new Date();

  return fecha.getFullYear() === hoy.getFullYear()
    && fecha.getMonth() === hoy.getMonth()
    && fecha.getDate() === hoy.getDate();
}

async function cerrar() {
  if (!clienteWhatsapp) {
    estado = 'desconectado';
    qrActual = null;
    return obtenerEstado();
  }

  await clienteWhatsapp.destroy();
  clienteWhatsapp = null;
  qrActual = null;
  estado = 'desconectado';
  fechaInicioServicio = null;
  return obtenerEstado();
}

function obtenerEstado() {
  return {
    estado,
    qr: qrActual,
    fechaInicioServicio
  };
}

module.exports = {
  iniciar,
  cerrar,
  obtenerEstado
};
