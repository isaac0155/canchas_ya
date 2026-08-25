const app = require('./app');
const env = require('./config/env');
const { probarConexion } = require('./config/database');

async function iniciarServidor() {
  try {
    await probarConexion();
    console.log('Conexion a MySQL correcta');

    const server = app.listen(env.port, () => {
      console.log(`Servidor iniciado en http://localhost:${env.port}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`El puerto ${env.port} ya esta en uso`);
        return;
      }

      console.error(error.message);
    });
  } catch (error) {
    console.error('No se pudo iniciar el servidor');
    console.error(error.message);
  }
}

iniciarServidor();
