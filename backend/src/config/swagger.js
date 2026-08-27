const swaggerJsdoc = require('swagger-jsdoc');

function jsonBody(schema, example) {
  return {
    required: true,
    content: {
      'application/json': {
        schema,
        example
      }
    }
  };
}

const schemas = {
  Login: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', example: 'admin@canchaya.com' },
      password: { type: 'string', example: 'Admin123' }
    }
  },
  Cliente: {
    type: 'object',
    required: ['nombre', 'telefono'],
    properties: {
      nombre: { type: 'string', example: 'Joel Hernandez' },
      telefono: { type: 'string', example: '65380266' }
    }
  },
  TipoCancha: {
    type: 'object',
    required: ['nombre'],
    properties: {
      nombre: { type: 'string', example: 'Futbol 5' }
    }
  },
  Cancha: {
    type: 'object',
    required: ['nombre', 'tipo_cancha_id', 'precio_por_hora'],
    properties: {
      nombre: { type: 'string', example: 'Cancha F5 Sintetico' },
      tipo_cancha_id: { type: 'number', example: 1 },
      precio_por_hora: { type: 'number', example: 120 },
      estado: { type: 'string', example: 'activa' }
    }
  },
  Reserva: {
    type: 'object',
    required: ['cliente_id', 'cancha_id', 'fecha_reserva', 'hora_inicio', 'hora_fin'],
    properties: {
      cliente_id: { type: 'number', example: 1 },
      cancha_id: { type: 'number', example: 1 },
      fecha_reserva: { type: 'string', example: '2026-09-10' },
      hora_inicio: { type: 'string', example: '20:00' },
      hora_fin: { type: 'string', example: '21:00' },
      estado: { type: 'string', example: 'confirmada' },
      origen: { type: 'string', example: 'admin' }
    }
  },
  Cancelacion: {
    type: 'object',
    required: ['motivo'],
    properties: {
      motivo: { type: 'string', example: 'El administrador no atendera en ese horario' }
    }
  },
  Horario: {
    type: 'object',
    required: ['atiende', 'hora_inicio', 'hora_fin'],
    properties: {
      atiende: { type: 'boolean', example: true },
      hora_inicio: { type: 'string', example: '17:00' },
      hora_fin: { type: 'string', example: '22:00' }
    }
  },
  FechaBloqueada: {
    type: 'object',
    required: ['fecha'],
    properties: {
      fecha: { type: 'string', example: '2026-09-15' },
      motivo: { type: 'string', example: 'Mantenimiento general' }
    }
  },
  WhatsappMensaje: {
    type: 'object',
    required: ['telefono', 'mensaje'],
    properties: {
      telefono: { type: 'string', example: '65380266' },
      nombre: { type: 'string', example: 'Joel Hernandez' },
      mensaje: { type: 'string', example: 'Quiero reservar futbol 5 para hoy de 7 a 9' }
    }
  }
};

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CanchaYa API',
      version: '1.0.0',
      description: 'API REST para administrar reservas de canchas deportivas'
    },
    servers: [{ url: 'http://localhost:3001/api' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token_admin'
        }
      },
      schemas
    },
    security: [
      { bearerAuth: [] },
      { cookieAuth: [] }
    ],
    paths: {
      '/salud': {
        get: {
          summary: 'Verifica que la API esta funcionando',
          security: [],
          responses: { 200: { description: 'API activa' } }
        }
      },
      '/auth/login': {
        post: {
          summary: 'Inicia sesion de administrador',
          security: [],
          requestBody: jsonBody(schemas.Login, { email: 'admin@canchaya.com', password: 'Admin123' }),
          responses: {
            200: { description: 'Login correcto' },
            400: { description: 'Datos invalidos' },
            401: { description: 'Credenciales incorrectas' }
          }
        }
      },
      '/auth/logout': {
        post: {
          summary: 'Cierra sesion del administrador',
          responses: { 200: { description: 'Sesion cerrada' } }
        }
      },
      '/auth/perfil': {
        get: {
          summary: 'Devuelve el administrador autenticado',
          responses: {
            200: { description: 'Perfil autenticado' },
            401: { description: 'No autenticado' }
          }
        }
      },
      '/clientes': {
        get: { summary: 'Lista clientes activos', responses: { 200: { description: 'Listado' } } },
        post: {
          summary: 'Crea un cliente',
          requestBody: jsonBody(schemas.Cliente, { nombre: 'Joel Hernandez', telefono: '65380266' }),
          responses: { 201: { description: 'Cliente creado' }, 400: { description: 'Datos invalidos' } }
        }
      },
      '/clientes/{id}': {
        get: { summary: 'Obtiene un cliente por id', parameters: [paramId()], responses: { 200: { description: 'Cliente' } } },
        put: {
          summary: 'Actualiza un cliente',
          parameters: [paramId()],
          requestBody: jsonBody(schemas.Cliente, { nombre: 'Joel Hernandez', telefono: '65380266' }),
          responses: { 200: { description: 'Cliente actualizado' } }
        },
        delete: { summary: 'Desactiva un cliente', parameters: [paramId()], responses: { 200: { description: 'Cliente desactivado' } } }
      },
      '/tipos-cancha': {
        get: { summary: 'Lista tipos de cancha activos', responses: { 200: { description: 'Listado' } } },
        post: {
          summary: 'Crea un tipo de cancha',
          requestBody: jsonBody(schemas.TipoCancha, { nombre: 'Futbol 11' }),
          responses: { 201: { description: 'Tipo creado' } }
        }
      },
      '/canchas': {
        get: { summary: 'Lista canchas activas', responses: { 200: { description: 'Listado' } } },
        post: {
          summary: 'Crea una cancha',
          requestBody: jsonBody(schemas.Cancha, { nombre: 'Cancha F5 Sintetico', tipo_cancha_id: 1, precio_por_hora: 120, estado: 'activa' }),
          responses: { 201: { description: 'Cancha creada' } }
        }
      },
      '/reservas': {
        get: { summary: 'Lista reservas', responses: { 200: { description: 'Listado' } } },
        post: {
          summary: 'Crea una reserva',
          requestBody: jsonBody(schemas.Reserva, {
            cliente_id: 1,
            cancha_id: 1,
            fecha_reserva: '2026-09-10',
            hora_inicio: '20:00',
            hora_fin: '21:00',
            estado: 'confirmada',
            origen: 'admin'
          }),
          responses: { 201: { description: 'Reserva creada' }, 400: { description: 'Datos invalidos' } }
        }
      },
      '/reservas/{id}': {
        get: { summary: 'Obtiene una reserva por id', parameters: [paramId()], responses: { 200: { description: 'Reserva' } } },
        put: {
          summary: 'Actualiza una reserva',
          parameters: [paramId()],
          requestBody: jsonBody(schemas.Reserva, {
            cliente_id: 1,
            cancha_id: 1,
            fecha_reserva: '2026-09-10',
            hora_inicio: '20:00',
            hora_fin: '21:00',
            estado: 'confirmada',
            origen: 'admin'
          }),
          responses: { 200: { description: 'Reserva actualizada' } }
        },
        delete: {
          summary: 'Cancela una reserva con motivo',
          parameters: [paramId()],
          requestBody: jsonBody(schemas.Cancelacion, { motivo: 'El administrador no atendera en ese horario' }),
          responses: { 200: { description: 'Reserva cancelada' } }
        }
      },
      '/reservas/{id}/asistio-pago': {
        patch: { summary: 'Marca que el cliente llego y pago', parameters: [paramId()], responses: { 200: { description: 'Reserva marcada' } } }
      },
      '/reservas/{id}/no-llego': {
        patch: { summary: 'Marca que el cliente no llego', parameters: [paramId()], responses: { 200: { description: 'Reserva marcada' } } }
      },
      '/reservas/metricas/resumen': {
        get: { summary: 'Obtiene metricas de reservas', responses: { 200: { description: 'Metricas' } } }
      },
      '/horarios': {
        get: { summary: 'Lista horarios y fechas bloqueadas', responses: { 200: { description: 'Configuracion' } } }
      },
      '/horarios/{diaSemana}': {
        put: {
          summary: 'Actualiza horario semanal',
          parameters: [{ name: 'diaSemana', in: 'path', required: true, schema: { type: 'number' }, example: 1 }],
          requestBody: jsonBody(schemas.Horario, { atiende: true, hora_inicio: '17:00', hora_fin: '22:00' }),
          responses: { 200: { description: 'Horario actualizado' } }
        }
      },
      '/horarios/fechas-bloqueadas': {
        post: {
          summary: 'Bloquea una fecha especifica',
          requestBody: jsonBody(schemas.FechaBloqueada, { fecha: '2026-09-15', motivo: 'Mantenimiento general' }),
          responses: { 201: { description: 'Fecha bloqueada' } }
        }
      },
      '/recordatorios/pendientes': {
        get: { summary: 'Lista recordatorios pendientes', responses: { 200: { description: 'Listado' } } }
      },
      '/recordatorios/procesar': {
        post: { summary: 'Procesa y envia recordatorios pendientes', responses: { 200: { description: 'Recordatorios procesados' } } }
      },
      '/whatsapp/mensaje': {
        post: {
          summary: 'Simula o procesa mensaje de WhatsApp',
          security: [],
          requestBody: jsonBody(schemas.WhatsappMensaje, {
            telefono: '65380266',
            nombre: 'Joel Hernandez',
            mensaje: 'Quiero reservar futbol 5 para hoy de 7 a 9'
          }),
          responses: { 200: { description: 'Respuesta del sistema' } }
        }
      },
      '/whatsapp/estado': {
        get: { summary: 'Consulta estado de WhatsApp real', responses: { 200: { description: 'Estado' } } }
      },
      '/whatsapp/iniciar': {
        post: { summary: 'Inicia WhatsApp real y genera QR', responses: { 200: { description: 'Estado' } } }
      },
      '/whatsapp/cerrar': {
        post: { summary: 'Cierra WhatsApp real', responses: { 200: { description: 'Estado' } } }
      }
    }
  },
  apis: []
});

function paramId() {
  return {
    name: 'id',
    in: 'path',
    required: true,
    schema: { type: 'number' },
    example: 1
  };
}

module.exports = swaggerSpec;
