const clienteRepository = require('../repositories/cliente.repository');

async function listarClientes() {
  return clienteRepository.listarActivos();
}

async function obtenerClientePorId(id) {
  return clienteRepository.obtenerPorId(id);
}

async function crearCliente(datos) {
  const cliente = prepararDatosCliente(datos);
  const clienteExistente = await clienteRepository.obtenerPorTelefono(cliente.telefono);

  if (clienteExistente) {
    throw new Error('Ya existe un cliente con ese telefono');
  }

  const id = await clienteRepository.crear(cliente);
  return clienteRepository.obtenerPorId(id);
}

async function actualizarCliente(id, datos) {
  const clienteActual = await clienteRepository.obtenerPorId(id);

  if (!clienteActual) {
    return null;
  }

  const cliente = prepararDatosCliente(datos);
  const clienteExistente = await clienteRepository.obtenerPorTelefono(cliente.telefono);

  if (clienteExistente && clienteExistente.id !== Number(id)) {
    throw new Error('Ya existe un cliente con ese telefono');
  }

  await clienteRepository.actualizar(id, cliente);
  return clienteRepository.obtenerPorId(id);
}

async function desactivarCliente(id) {
  const clienteActual = await clienteRepository.obtenerPorId(id);

  if (!clienteActual) {
    return null;
  }

  await clienteRepository.desactivar(id);
  return true;
}

function prepararDatosCliente(datos) {
  const nombre = prepararTexto(datos.nombre, 'El nombre es obligatorio');
  const telefono = prepararTelefono(datos.telefono);
  const estado = datos.estado || 'activo';

  if (!['activo', 'inactivo'].includes(estado)) {
    throw new Error('El estado del cliente no es valido');
  }

  return {
    nombre,
    telefono,
    estado
  };
}

function prepararTexto(valor, mensajeError) {
  if (!valor || valor.trim() === '') {
    throw new Error(mensajeError);
  }

  return valor.trim();
}

function prepararTelefono(telefono) {
  if (!telefono || telefono.trim() === '') {
    throw new Error('El telefono es obligatorio');
  }

  const telefonoLimpio = telefono.trim();

  if (telefonoLimpio.length < 7) {
    throw new Error('El telefono debe tener al menos 7 digitos');
  }

  return telefonoLimpio;
}

module.exports = {
  listarClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarCliente,
  desactivarCliente
};
