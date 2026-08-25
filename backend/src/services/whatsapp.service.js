const clienteRepository = require('../repositories/cliente.repository');
const canchaRepository = require('../repositories/cancha.repository');
const reservaService = require('./reserva.service');
const geminiService = require('./gemini.service');
const horarioService = require('./horario.service');

const conversaciones = {};

async function procesarMensaje(datos) {
  const telefono = prepararTelefono(datos.telefono);
  const mensaje = prepararMensaje(datos.mensaje);
  let cliente = await clienteRepository.obtenerPorTelefono(telefono);

  if (!cliente) {
    if (!datos.nombre || datos.nombre.trim() === '') {
      return {
        estado: 'cliente_nuevo',
        respuesta: 'Hola, es tu primera vez en CanchaYa. Por favor enviame tu nombre completo para registrarte.'
      };
    }

    const id = await clienteRepository.crear({
      nombre: datos.nombre.trim(),
      telefono,
      estado: 'activo'
    });
    cliente = await clienteRepository.obtenerPorId(id);
  }

  const respuestaPendiente = await atenderConversacionEnCurso(telefono, mensaje, cliente);

  if (respuestaPendiente) {
    return respuestaPendiente;
  }

  const respuestaMenu = await atenderMenu(telefono, mensaje, cliente);

  if (respuestaMenu) {
    return respuestaMenu;
  }

  let datosReserva = interpretarMensaje(mensaje);

  if (!datosReserva.fecha_reserva || !datosReserva.hora_inicio || !datosReserva.hora_fin || !datosReserva.tipo_cancha) {
    const datosGemini = await geminiService.interpretarReserva(mensaje);

    if (datosGemini) {
      datosReserva = {
        fecha_reserva: datosReserva.fecha_reserva || datosGemini.fecha_reserva,
        hora_inicio: datosReserva.hora_inicio || datosGemini.hora_inicio,
        hora_fin: datosReserva.hora_fin || datosGemini.hora_fin,
        tipo_cancha: datosReserva.tipo_cancha || datosGemini.tipo_cancha
      };
    }
  }

  if (!datosReserva.fecha_reserva || !datosReserva.hora_inicio || !datosReserva.hora_fin) {
    return {
      estado: 'faltan_datos',
      cliente,
      respuesta: 'Necesito fecha, hora de inicio y hora de fin. Ejemplo: reservar 2026-09-10 20:00 21:00.'
    };
  }

  if (!datosReserva.tipo_cancha) {
    guardarContextoReserva(telefono, datosReserva);

    return {
      estado: 'falta_cancha',
      cliente,
      respuesta: `Entendi la fecha y la hora. Ahora dime que cancha quieres:\n${await obtenerTextoOpcionesCancha()}`
    };
  }

  return prepararConfirmacionReserva(telefono, cliente, datosReserva);
}

async function atenderConversacionEnCurso(telefono, mensaje, cliente) {
  const contexto = conversaciones[telefono];

  if (!contexto || !['reservar', 'confirmar_reserva'].includes(contexto.accion)) {
    return null;
  }

  const texto = normalizarTexto(mensaje);

  if (texto === 'cancelar') {
    limpiarContexto(telefono);

    return {
      estado: 'reserva_cancelada_por_cliente',
      cliente,
      respuesta: 'Listo, cancele esta solicitud de reserva. Puedes escribir menu para empezar de nuevo.'
    };
  }

  if (contexto.accion === 'confirmar_reserva') {
    return atenderConfirmacionReserva(telefono, texto, mensaje, cliente, contexto);
  }

  const datosMensaje = interpretarMensaje(mensaje);
  const datosReserva = {
    fecha_reserva: datosMensaje.fecha_reserva || contexto.datosReserva.fecha_reserva,
    hora_inicio: datosMensaje.hora_inicio || contexto.datosReserva.hora_inicio,
    hora_fin: datosMensaje.hora_fin || contexto.datosReserva.hora_fin,
    tipo_cancha: datosMensaje.tipo_cancha || contexto.datosReserva.tipo_cancha
  };

  if (!datosReserva.fecha_reserva || !datosReserva.hora_inicio || !datosReserva.hora_fin) {
    guardarContextoReserva(telefono, datosReserva);

    return {
      estado: 'faltan_datos',
      cliente,
      respuesta: obtenerMensajeDatoFaltante(datosReserva)
    };
  }

  if (!datosReserva.tipo_cancha) {
    guardarContextoReserva(telefono, datosReserva);

    return {
      estado: 'falta_cancha',
      cliente,
      respuesta: `Todavia necesito saber que cancha quieres:\n${await obtenerTextoOpcionesCancha()}`
    };
  }

  return prepararConfirmacionReserva(telefono, cliente, datosReserva);
}

async function atenderConfirmacionReserva(telefono, texto, mensaje, cliente, contexto) {
  if (['confirmar', 'si', 'ok', 'dale'].includes(texto)) {
    limpiarContexto(telefono);
    const resultado = await crearReservaDesdeWhatsApp(cliente, contexto.datosReserva);

    if (resultado.estado === 'sin_cancha') {
      guardarContextoReserva(telefono, {
        fecha_reserva: contexto.datosReserva.fecha_reserva,
        hora_inicio: contexto.datosReserva.hora_inicio,
        hora_fin: contexto.datosReserva.hora_fin,
        tipo_cancha: null
      });
    }

    return resultado;
  }

  if (texto === 'cambiar') {
    guardarContextoReserva(telefono, contexto.datosReserva, 'reservar');

    return {
      estado: 'cambiar_reserva',
      cliente,
      respuesta: 'Claro. Enviame el dato que quieres cambiar: fecha, horario o cancha.'
    };
  }

  const datosMensaje = interpretarMensaje(mensaje);
  const datosReserva = {
    fecha_reserva: datosMensaje.fecha_reserva || contexto.datosReserva.fecha_reserva,
    hora_inicio: datosMensaje.hora_inicio || contexto.datosReserva.hora_inicio,
    hora_fin: datosMensaje.hora_fin || contexto.datosReserva.hora_fin,
    tipo_cancha: datosMensaje.tipo_cancha || contexto.datosReserva.tipo_cancha
  };

  guardarContextoReserva(telefono, datosReserva, 'confirmar_reserva');
  return prepararConfirmacionReserva(telefono, cliente, datosReserva);
}

function obtenerMensajeDatoFaltante(datosReserva) {
  if (!datosReserva.fecha_reserva) {
    return 'Para reservar necesito la fecha. Puedes escribir: hoy, mañana o 2026-09-10.';
  }

  if (!datosReserva.hora_inicio || !datosReserva.hora_fin) {
    return 'Ahora dime el horario. Ejemplo: de 7 a 9 o 20:00 21:00.';
  }

  return 'Ahora dime que cancha quieres.';
}

function guardarContextoReserva(telefono, datosReserva, accion = 'reservar') {
  conversaciones[telefono] = {
    accion,
    datosReserva,
    actualizadoEn: new Date()
  };
}

function limpiarContexto(telefono) {
  delete conversaciones[telefono];
}

async function crearReservaDesdeWhatsApp(cliente, datosReserva) {
  const cancha = await buscarCancha(datosReserva.tipo_cancha);

  if (!cancha) {
    return {
      estado: 'sin_cancha',
      cliente,
      respuesta: `No encontre una cancha activa para esa solicitud. Puedes elegir:\n${await obtenerTextoOpcionesCancha()}`
    };
  }

  let reserva;

  try {
    reserva = await reservaService.crearReserva({
      cliente_id: cliente.id,
      cancha_id: cancha.id,
      fecha_reserva: datosReserva.fecha_reserva,
      hora_inicio: datosReserva.hora_inicio,
      hora_fin: datosReserva.hora_fin,
      estado: 'confirmada',
      origen: 'whatsapp'
    });
  } catch (error) {
    return {
      estado: 'reserva_rechazada',
      cliente,
      respuesta: `No pude confirmar la reserva: ${error.message}. Puedes probar con otro horario.`
    };
  }

  return {
    estado: 'reserva_confirmada',
    cliente,
    reserva,
    respuesta: `Reserva confirmada para ${cliente.nombre}: ${reserva.cancha}, ${reserva.fecha_reserva} de ${reserva.hora_inicio} a ${reserva.hora_fin}.`
  };
}

async function prepararConfirmacionReserva(telefono, cliente, datosReserva) {
  const cancha = await buscarCancha(datosReserva.tipo_cancha);

  if (!cancha) {
    guardarContextoReserva(telefono, {
      fecha_reserva: datosReserva.fecha_reserva,
      hora_inicio: datosReserva.hora_inicio,
      hora_fin: datosReserva.hora_fin,
      tipo_cancha: null
    });

    return {
      estado: 'sin_cancha',
      cliente,
      respuesta: `No hay una cancha activa de tipo ${datosReserva.tipo_cancha}. Puedes elegir:\n${await obtenerTextoOpcionesCancha()}`
    };
  }

  try {
    await reservaService.validarReservaSinCrear({
      cliente_id: cliente.id,
      cancha_id: cancha.id,
      fecha_reserva: datosReserva.fecha_reserva,
      hora_inicio: datosReserva.hora_inicio,
      hora_fin: datosReserva.hora_fin,
      estado: 'confirmada',
      origen: 'whatsapp'
    });
  } catch (error) {
    guardarContextoReserva(telefono, {
      fecha_reserva: datosReserva.fecha_reserva,
      hora_inicio: null,
      hora_fin: null,
      tipo_cancha: datosReserva.tipo_cancha
    });

    return {
      estado: 'reserva_rechazada',
      cliente,
      respuesta: `Ese horario no esta disponible: ${error.message}. Enviame otro horario para ${datosReserva.tipo_cancha}.`
    };
  }

  guardarContextoReserva(telefono, datosReserva, 'confirmar_reserva');
  return pedirConfirmacionReserva(cliente, datosReserva, cancha);
}

function pedirConfirmacionReserva(cliente, datosReserva, cancha) {
  return {
    estado: 'confirmar_reserva',
    cliente,
    respuesta: `Tengo estos datos:\nCancha: ${cancha.nombre} (${datosReserva.tipo_cancha})\nFecha: ${datosReserva.fecha_reserva}\nHorario: ${datosReserva.hora_inicio} a ${datosReserva.hora_fin}\n\nResponde confirmar para guardar la reserva, cambiar para corregir algo o cancelar para abandonar.`
  };
}

function interpretarMensaje(mensaje) {
  const fecha = obtenerFecha(mensaje);
  const horas = obtenerHoras(mensaje);

  return {
    fecha_reserva: fecha,
    hora_inicio: horas[0] || null,
    hora_fin: horas[1] || null,
    tipo_cancha: obtenerTipoCancha(mensaje)
  };
}

function obtenerFecha(mensaje) {
  const texto = mensaje.toLowerCase();
  const fecha = texto.match(/\d{4}-\d{2}-\d{2}/);

  if (fecha) {
    return fecha[0];
  }

  const hoy = new Date();

  if (texto.includes('mañana') || texto.includes('manana')) {
    hoy.setDate(hoy.getDate() + 1);
    return hoy.toISOString().slice(0, 10);
  }

  if (texto.includes('hoy')) {
    return hoy.toISOString().slice(0, 10);
  }

  if (texto.includes('reservar') || texto.includes('reserva')) {
    return hoy.toISOString().slice(0, 10);
  }

  return null;
}

function obtenerHoras(mensaje) {
  const texto = mensaje.toLowerCase();
  const horasConMinutos = texto.match(/\d{1,2}:\d{2}/g);

  if (horasConMinutos && horasConMinutos.length >= 2) {
    return horasConMinutos.slice(0, 2).map((hora) => normalizarHora(hora, texto));
  }

  const rango = texto.match(/(?:de\s+)?(\d{1,2})(?:\s*(?:a|-)\s*)(\d{1,2})/);

  if (rango) {
    return [normalizarHora(rango[1], texto), normalizarHora(rango[2], texto)];
  }

  return [];
}

function normalizarHora(hora, texto) {
  const partes = hora.split(':');
  let horaNumero = Number(partes[0]);
  const minutos = partes[1] || '00';

  if (texto.includes('am')) {
    return `${String(horaNumero).padStart(2, '0')}:${minutos}`;
  }

  if (texto.includes('pm') && horaNumero < 12) {
    horaNumero += 12;
  }

  if (!texto.includes('am') && !texto.includes('pm') && horaNumero < 12) {
    horaNumero += 12;
  }

  return `${String(horaNumero).padStart(2, '0')}:${minutos}`;
}

function obtenerTipoCancha(mensaje) {
  const texto = normalizarTexto(mensaje);

  if (texto.includes('futbol 7') || texto.includes('futbol7')) {
    return 'Futbol 7';
  }

  if (texto.includes('futbol 5') || texto.includes('futbol5') || texto.includes('fut')) {
    return 'Futbol 5';
  }

  if (texto.includes('basquet')) {
    return 'Basquet';
  }

  if (texto.includes('voley')) {
    return 'Voley';
  }

  if (texto.includes('wally')) {
    return 'Wally';
  }

  return null;
}

function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

async function buscarCancha(tipoCancha) {
  const canchas = await canchaRepository.listarActivas();

  return canchas.find((cancha) => cancha.tipo_cancha === tipoCancha);
}

async function atenderMenu(telefono, mensaje, cliente) {
  const texto = normalizarTexto(mensaje);
  const pareceReserva = texto.includes('reservar') || texto.includes('reserva');

  if (!pareceReserva && (['hola', 'menu', 'menú', 'inicio'].includes(texto) || texto.startsWith('hola '))) {
    return {
      estado: 'menu',
      cliente,
      respuesta: obtenerTextoMenu(cliente.nombre)
    };
  }

  if (texto === '1' || texto === 'opcion 1' || texto === 'opción 1') {
    guardarContextoReserva(telefono, {
      fecha_reserva: null,
      hora_inicio: null,
      hora_fin: null,
      tipo_cancha: null
    });

    return {
      estado: 'menu_reserva',
      cliente,
      respuesta: 'Perfecto, empecemos tu reserva. Dime la fecha: hoy, mañana o una fecha como 2026-09-10.'
    };
  }

  if (texto === '2' || texto === 'opcion 2' || texto === 'opción 2') {
    const canchas = await canchaRepository.listarActivas();
    const nombres = canchas.map((cancha) => `- ${cancha.nombre} (${cancha.tipo_cancha})`).join('\n');

    return {
      estado: 'menu_canchas',
      cliente,
      respuesta: `Canchas disponibles:\n${nombres || 'No hay canchas activas por ahora.'}`
    };
  }

  if (texto === '3' || texto === 'opcion 3' || texto === 'opción 3') {
    const configuracion = await horarioService.listarConfiguracion();
    const horarios = configuracion.horarios
      .map((horario) => {
        const dia = obtenerNombreDia(horario.dia_semana);

        if (!horario.atiende) {
          return `- ${dia}: no se atiende`;
        }

        return `- ${dia}: ${horario.hora_inicio} a ${horario.hora_fin}`;
      })
      .join('\n');

    return {
      estado: 'menu_horarios',
      cliente,
      respuesta: `Horarios de atencion:\n${horarios}`
    };
  }

  return null;
}

async function obtenerTextoOpcionesCancha() {
  const tipos = await obtenerTiposCanchaActivos();

  if (tipos.length === 0) {
    return 'No hay canchas activas por ahora.';
  }

  return tipos.map((tipo) => `- ${tipo}`).join('\n');
}

async function obtenerTiposCanchaActivos() {
  const canchas = await canchaRepository.listarActivas();
  const tipos = canchas.map((cancha) => cancha.tipo_cancha);

  return [...new Set(tipos)];
}

function obtenerTextoMenu(nombre) {
  return `Hola ${nombre}. Soy CanchaYa.\n1. Reservar una cancha\n2. Ver canchas disponibles\n3. Ver horarios de atencion\nTambien puedes escribir tu reserva directamente.`;
}

function obtenerNombreDia(diaSemana) {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  return dias[diaSemana] || 'Dia';
}

function prepararTelefono(telefono) {
  if (!telefono || telefono.trim() === '') {
    throw new Error('El telefono es obligatorio');
  }

  return telefono.trim();
}

function prepararMensaje(mensaje) {
  if (!mensaje || mensaje.trim() === '') {
    throw new Error('El mensaje es obligatorio');
  }

  return mensaje.trim();
}

module.exports = {
  procesarMensaje
};
