const app = require('./app');
const env = require('./config/env');
const { iniciarTypeOrm } = require('./config/typeorm');

async function iniciarServidor() {
  try {
    await iniciarTypeOrm();
    console.log('Conexion a MySQL con TypeORM correcta');

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
