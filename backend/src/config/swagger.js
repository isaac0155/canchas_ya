const swaggerJsdoc = require('swagger-jsdoc');

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CanchaYa API',
      version: '1.0.0',
      description: 'API REST para administrar reservas de canchas deportivas'
    },
    servers: [
      {
        url: 'http://localhost:3001/api'
      }
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token_admin'
        }
      }
    },
    security: [
      {
        cookieAuth: []
      }
    ],
    paths: {
      '/salud': {
        get: {
          summary: 'Verifica que la API esta funcionando',
          security: [],
          responses: {
            200: {
              description: 'API activa'
            }
          }
        }
      },
      '/auth/login': {
        post: {
          summary: 'Inicia sesion de administrador',
          security: [],
          responses: {
            200: { description: 'Login correcto' },
            401: { description: 'Credenciales incorrectas' }
          }
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
        post: { summary: 'Crea un cliente', responses: { 201: { description: 'Cliente creado' } } }
      },
      '/canchas': {
        get: { summary: 'Lista canchas activas', responses: { 200: { description: 'Listado' } } },
        post: { summary: 'Crea una cancha', responses: { 201: { description: 'Cancha creada' } } }
      },
      '/reservas': {
        get: { summary: 'Lista reservas', responses: { 200: { description: 'Listado' } } },
        post: { summary: 'Crea una reserva', responses: { 201: { description: 'Reserva creada' } } }
      },
      '/reservas/metricas/resumen': {
        get: { summary: 'Obtiene metricas de reservas', responses: { 200: { description: 'Metricas' } } }
      },
      '/recordatorios/pendientes': {
        get: { summary: 'Lista recordatorios pendientes', responses: { 200: { description: 'Listado' } } }
      },
      '/whatsapp/estado': {
        get: { summary: 'Consulta estado de WhatsApp real', responses: { 200: { description: 'Estado' } } }
      }
    }
  },
  apis: []
});

module.exports = swaggerSpec;
