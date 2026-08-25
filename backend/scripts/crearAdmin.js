require('dotenv').config();

const bcrypt = require('bcryptjs');
const administradorRepository = require('../src/repositories/administrador.repository');
const { pool } = require('../src/config/database');

async function crearAdmin() {
  const nombre = process.argv[2];
  const email = process.argv[3];
  const password = process.argv[4];

  if (!nombre || !email || !password) {
    console.log('Uso: node scripts/crearAdmin.js "Nombre" email password');
    process.exit(1);
  }

  const emailNormalizado = email.trim().toLowerCase();
  const adminExistente = await administradorRepository.obtenerPorEmail(emailNormalizado);

  if (adminExistente) {
    console.log('Ya existe un administrador con ese email');
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await administradorRepository.crear({
    nombre: nombre.trim(),
    email: emailNormalizado,
    password_hash: passwordHash,
    estado: 'activo'
  });

  console.log('Administrador creado correctamente');
  await pool.end();
}

crearAdmin().catch(async (error) => {
  console.error(error.message);
  await pool.end();
  process.exit(1);
});
