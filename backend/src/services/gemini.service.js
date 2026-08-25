const env = require('../config/env');

async function interpretarReserva(mensaje) {
  if (!env.geminiApiKey) {
    return null;
  }

  const prompt = `
Extrae datos de una solicitud de reserva de cancha.
Responde solo JSON valido con estas claves:
fecha_reserva, hora_inicio, hora_fin, tipo_cancha.

Reglas:
- fecha_reserva debe ser YYYY-MM-DD o null.
- hora_inicio y hora_fin deben ser HH:mm o null.
- tipo_cancha puede ser Futbol 5, Futbol 7, Basquet, Voley o null.
- Si el cliente dice "hoy", usa la fecha actual: ${new Date().toISOString().slice(0, 10)}.
- Si el cliente dice "mañana", usa la fecha de mañana.
- Si el cliente quiere reservar pero no menciona fecha, asume la fecha actual: ${new Date().toISOString().slice(0, 10)}.
- Si dice "de 7 a 9" sin AM/PM, asume noche: 19:00 a 21:00.
- Si no menciona el tipo de cancha, tipo_cancha debe ser null.

Mensaje: ${mensaje}
`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${env.geminiModel}:generateContent?key=${env.geminiApiKey}`;

  const respuesta = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ]
    })
  });

  if (!respuesta.ok) {
    return null;
  }

  const data = await respuesta.json();
  const texto = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const jsonTexto = limpiarJson(texto);

  try {
    return JSON.parse(jsonTexto);
  } catch (error) {
    return null;
  }
}

function limpiarJson(texto) {
  return texto
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();
}

module.exports = {
  interpretarReserva
};
