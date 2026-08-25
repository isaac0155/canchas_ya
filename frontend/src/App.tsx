import { FormEvent, useEffect, useMemo, useState } from 'react';
import './App.css';

const API_URL = '/api';

type Administrador = {
  id: number;
  nombre: string;
  email: string;
};

type TipoCancha = {
  id: number;
  nombre: string;
  estado: string;
};

type Cancha = {
  id: number;
  nombre: string;
  tipo_cancha: string;
  precio_por_hora: string;
  estado: string;
};

type Cliente = {
  id: number;
  nombre: string;
  telefono: string;
  estado: string;
};

type Reserva = {
  id: number;
  cliente_id: number;
  cancha_id: number;
  fecha_reserva: string;
  hora_inicio: string;
  hora_fin: string;
  estado: string;
  origen: string;
  recordatorio_enviado: number;
  cliente: string;
  cancha: string;
};

type Recordatorio = {
  id: number;
  fecha_reserva: string;
  hora_inicio: string;
  hora_fin: string;
  cliente: string;
  telefono_cliente: string;
  cancha: string;
};

type HorarioAtencion = {
  id: number;
  dia_semana: number;
  atiende: number;
  hora_inicio: string;
  hora_fin: string;
};

type FechaBloqueada = {
  id: number;
  fecha: string;
  motivo: string | null;
};

type DatosPanel = {
  tiposCancha: TipoCancha[];
  canchas: Cancha[];
  clientes: Cliente[];
  reservas: Reserva[];
  recordatorios: Recordatorio[];
  horarios: HorarioAtencion[];
  fechasBloqueadas: FechaBloqueada[];
};

type Vista = 'dashboard' | 'reservas' | 'canchas' | 'clientes' | 'horarios' | 'recordatorios' | 'whatsapp';

const datosVacios: DatosPanel = {
  tiposCancha: [],
  canchas: [],
  clientes: [],
  reservas: [],
  recordatorios: [],
  horarios: [],
  fechasBloqueadas: []
};

function App() {
  const [administrador, setAdministrador] = useState<Administrador | null>(null);
  const [email, setEmail] = useState('admin@canchaya.com');
  const [password, setPassword] = useState('Admin123');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const [datos, setDatos] = useState<DatosPanel>(datosVacios);
  const [ultimaActualizacion, setUltimaActualizacion] = useState('');
  const [tipoNombre, setTipoNombre] = useState('');
  const [clienteNombre, setClienteNombre] = useState('');
  const [clienteTelefono, setClienteTelefono] = useState('');
  const [canchaNombre, setCanchaNombre] = useState('');
  const [canchaTipoId, setCanchaTipoId] = useState('');
  const [canchaPrecio, setCanchaPrecio] = useState('');
  const [reservaClienteId, setReservaClienteId] = useState('');
  const [reservaCanchaId, setReservaCanchaId] = useState('');
  const [reservaFecha, setReservaFecha] = useState('');
  const [reservaHoraInicio, setReservaHoraInicio] = useState('');
  const [reservaHoraFin, setReservaHoraFin] = useState('');
  const [mensajePanel, setMensajePanel] = useState('');
  const [vistaActual, setVistaActual] = useState<Vista>('dashboard');
  const [fechaDashboard, setFechaDashboard] = useState(new Date().toISOString().slice(0, 10));
  const [clienteBusqueda, setClienteBusqueda] = useState('');
  const [whatsappTelefono, setWhatsappTelefono] = useState('');
  const [whatsappNombre, setWhatsappNombre] = useState('');
  const [whatsappMensaje, setWhatsappMensaje] = useState('Quiero reservar futbol 5 el 2026-09-10 de 20:00 a 21:00');
  const [whatsappRespuesta, setWhatsappRespuesta] = useState('');
  const [whatsappEstado, setWhatsappEstado] = useState('desconectado');
  const [whatsappQr, setWhatsappQr] = useState('');
  const [fechaBloqueada, setFechaBloqueada] = useState('');
  const [motivoBloqueo, setMotivoBloqueo] = useState('');

  useEffect(() => {
    obtenerPerfil();
  }, []);

  useEffect(() => {
    if (!administrador) {
      return;
    }

    const intervalo = window.setInterval(() => {
      cargarPanel();
    }, 10000);

    return () => window.clearInterval(intervalo);
  }, [administrador]);

  const reservasPendientes = useMemo(
    () => datos.reservas.filter((reserva) => reserva.estado === 'pendiente').length,
    [datos.reservas]
  );

  const reservasConfirmadas = useMemo(
    () => datos.reservas.filter((reserva) => reserva.estado === 'confirmada').length,
    [datos.reservas]
  );

  const canchasEnMantenimiento = useMemo(
    () => datos.canchas.filter((cancha) => cancha.estado === 'mantenimiento').length,
    [datos.canchas]
  );

  async function obtenerPerfil() {
    const respuesta = await fetch(`${API_URL}/auth/perfil`, {
      credentials: 'include'
    });

    if (!respuesta.ok) {
      return;
    }

    const data = await respuesta.json();
    setAdministrador(data.administrador);
    cargarPanel();
  }

  async function iniciarSesion(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setCargando(true);
    setMensaje('');

    const respuesta = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });

    const data = await respuesta.json();
    setCargando(false);

    if (!respuesta.ok) {
      setMensaje(data.mensaje || 'No se pudo iniciar sesion');
      return;
    }

    setAdministrador(data.administrador);
    cargarPanel();
  }

  async function cerrarSesion() {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });

    setAdministrador(null);
    setDatos(datosVacios);
    setUltimaActualizacion('');
    setMensajePanel('');
  }

  async function cargarPanel() {
    const [tiposCancha, canchas, clientes, reservas, recordatorios, horariosConfig] = await Promise.all([
      pedirDatos<TipoCancha[]>('/tipos-cancha'),
      pedirDatos<Cancha[]>('/canchas'),
      pedirDatos<Cliente[]>('/clientes'),
      pedirDatos<Reserva[]>('/reservas'),
      pedirDatos<Recordatorio[]>('/recordatorios/pendientes'),
      pedirDatos<{ horarios: HorarioAtencion[]; fechasBloqueadas: FechaBloqueada[] }>('/horarios')
    ]);

    setDatos({
      tiposCancha,
      canchas,
      clientes,
      reservas,
      recordatorios,
      horarios: horariosConfig.horarios,
      fechasBloqueadas: horariosConfig.fechasBloqueadas
    });
    setUltimaActualizacion(new Date().toLocaleTimeString());
    await cargarEstadoWhatsapp();
  }

  async function cargarEstadoWhatsapp() {
    try {
      const estado = await pedirDatos<{ estado: string; qr: string | null }>('/whatsapp/estado');
      setWhatsappEstado(estado.estado);
      setWhatsappQr(estado.qr || '');
    } catch (error) {
      setWhatsappEstado('desconectado');
      setWhatsappQr('');
    }
  }

  async function pedirDatos<T>(ruta: string): Promise<T> {
    const respuesta = await fetch(`${API_URL}${ruta}`, {
      credentials: 'include'
    });

    if (!respuesta.ok) {
      throw new Error('No se pudieron cargar los datos');
    }

    return respuesta.json();
  }

  async function enviarDatos(ruta: string, metodo: string, cuerpo?: object) {
    const respuesta = await fetch(`${API_URL}${ruta}`, {
      method: metodo,
      headers: cuerpo ? { 'Content-Type': 'application/json' } : undefined,
      credentials: 'include',
      body: cuerpo ? JSON.stringify(cuerpo) : undefined
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(data.mensaje || 'No se pudo completar la accion');
    }

    return data;
  }

  async function crearTipoCancha(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    await ejecutarAccion(async () => {
      await enviarDatos('/tipos-cancha', 'POST', { nombre: tipoNombre });
      setTipoNombre('');
    });
  }

  async function crearCliente(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    await ejecutarAccion(async () => {
      await enviarDatos('/clientes', 'POST', {
        nombre: clienteNombre,
        telefono: clienteTelefono
      });
      setClienteNombre('');
      setClienteTelefono('');
    });
  }

  async function crearCancha(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    await ejecutarAccion(async () => {
      await enviarDatos('/canchas', 'POST', {
        nombre: canchaNombre,
        tipo_cancha_id: Number(canchaTipoId),
        precio_por_hora: Number(canchaPrecio),
        estado: 'activa'
      });
      setCanchaNombre('');
      setCanchaTipoId('');
      setCanchaPrecio('');
    });
  }

  async function crearReserva(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    await ejecutarAccion(async () => {
      await enviarDatos('/reservas', 'POST', {
        cliente_id: Number(reservaClienteId),
        cancha_id: Number(reservaCanchaId),
        fecha_reserva: reservaFecha,
        hora_inicio: reservaHoraInicio,
        hora_fin: reservaHoraFin,
        estado: 'confirmada',
        origen: 'admin'
      });
      setReservaClienteId('');
      setReservaCanchaId('');
      setReservaFecha('');
      setReservaHoraInicio('');
      setReservaHoraFin('');
    });
  }

  async function desactivarTipo(id: number) {
    await ejecutarAccion(() => enviarDatos(`/tipos-cancha/${id}`, 'DELETE'));
  }

  async function desactivarCancha(id: number) {
    await ejecutarAccion(() => enviarDatos(`/canchas/${id}`, 'DELETE'));
  }

  async function desactivarCliente(id: number) {
    await ejecutarAccion(() => enviarDatos(`/clientes/${id}`, 'DELETE'));
  }

  async function cancelarReserva(id: number) {
    await ejecutarAccion(() => enviarDatos(`/reservas/${id}`, 'DELETE'));
  }

  async function cambiarEstadoReserva(reserva: Reserva, estado: string) {
    await ejecutarAccion(() => enviarDatos(`/reservas/${reserva.id}`, 'PUT', {
      cliente_id: reserva.cliente_id,
      cancha_id: reserva.cancha_id,
      fecha_reserva: reserva.fecha_reserva,
      hora_inicio: reserva.hora_inicio,
      hora_fin: reserva.hora_fin,
      estado,
      origen: reserva.origen || 'admin',
      recordatorio_enviado: Boolean(reserva.recordatorio_enviado)
    }));
  }

  async function procesarRecordatorios() {
    await ejecutarAccion(() => enviarDatos('/recordatorios/procesar', 'POST'));
  }

  async function simularWhatsapp(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    await ejecutarAccion(async () => {
      const respuesta = await enviarDatos('/whatsapp/mensaje', 'POST', {
        telefono: whatsappTelefono,
        nombre: whatsappNombre,
        mensaje: whatsappMensaje
      });
      setWhatsappRespuesta(respuesta.respuesta);
      await cargarPanel();
    });
  }

  async function iniciarWhatsappReal() {
    await ejecutarAccion(async () => {
      const estado = await enviarDatos('/whatsapp/iniciar', 'POST');
      setWhatsappEstado(estado.estado);
      setWhatsappQr(estado.qr || '');
    });
  }

  async function cerrarWhatsappReal() {
    await ejecutarAccion(async () => {
      const estado = await enviarDatos('/whatsapp/cerrar', 'POST');
      setWhatsappEstado(estado.estado);
      setWhatsappQr('');
    });
  }

  async function actualizarHorario(horario: HorarioAtencion, cambios: Partial<HorarioAtencion>) {
    await ejecutarAccion(() => enviarDatos(`/horarios/${horario.dia_semana}`, 'PUT', {
      atiende: cambios.atiende ?? Boolean(horario.atiende),
      hora_inicio: cambios.hora_inicio ?? horario.hora_inicio,
      hora_fin: cambios.hora_fin ?? horario.hora_fin
    }));
  }

  async function bloquearFecha(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    await ejecutarAccion(async () => {
      await enviarDatos('/horarios/fechas-bloqueadas', 'POST', {
        fecha: fechaBloqueada,
        motivo: motivoBloqueo
      });
      setFechaBloqueada('');
      setMotivoBloqueo('');
    });
  }

  async function eliminarFechaBloqueada(id: number) {
    await ejecutarAccion(() => enviarDatos(`/horarios/fechas-bloqueadas/${id}`, 'DELETE'));
  }

  async function ejecutarAccion(accion: () => Promise<unknown>) {
    try {
      setMensajePanel('');
      await accion();
      await cargarPanel();
      setMensajePanel('Accion realizada correctamente');
    } catch (error) {
      setMensajePanel(error instanceof Error ? error.message : 'Ocurrio un error');
    }
  }

  if (!administrador) {
    return (
      <main className="login-screen">
        <section className="login-box">
          <div className="brand-block">
            <strong>CanchaYa</strong>
            <span>Administracion de reservas</span>
          </div>

          <form onSubmit={iniciarSesion} className="access-form">
            <h1>Ingreso administrador</h1>

            <label>
              Email
              <input
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
                type="email"
              />
            </label>

            <label>
              Contrasena
              <input
                value={password}
                onChange={(evento) => setPassword(evento.target.value)}
                type="password"
              />
            </label>

            {mensaje && <p className="error-text">{mensaje}</p>}

            <button type="submit" disabled={cargando}>
              {cargando ? 'Validando acceso' : 'Entrar al panel'}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <aside className="side-menu">
        <div className="side-brand">
          <span className="brand-mark">CY</span>
          <strong>CanchaYa</strong>
        </div>

        <nav>
          <p>Principal</p>
          <button className={vistaActual === 'dashboard' ? 'active-link' : ''} onClick={() => setVistaActual('dashboard')}>Dashboard</button>
          <button className={vistaActual === 'reservas' ? 'active-link' : ''} onClick={() => setVistaActual('reservas')}>Reservas</button>
          <button className={vistaActual === 'canchas' ? 'active-link' : ''} onClick={() => setVistaActual('canchas')}>Canchas</button>
          <button className={vistaActual === 'clientes' ? 'active-link' : ''} onClick={() => setVistaActual('clientes')}>Clientes</button>
          <button className={vistaActual === 'horarios' ? 'active-link' : ''} onClick={() => setVistaActual('horarios')}>Horarios</button>
          <p>Operacion</p>
          <button className={vistaActual === 'recordatorios' ? 'active-link' : ''} onClick={() => setVistaActual('recordatorios')}>Recordatorios</button>
          <button className={vistaActual === 'whatsapp' ? 'active-link' : ''} onClick={() => setVistaActual('whatsapp')}>WhatsApp</button>
        </nav>

        <div className="side-note">
          <strong>Actualizacion</strong>
          <span>Cada 10 segundos</span>
        </div>
      </aside>

      <section className="main-area">
        <header className="top-line">
          <h1>{obtenerTituloVista(vistaActual)}</h1>

          <div className="top-actions">
            <span className="search-pill">{mensajePanel || 'Gestion administrativa'}</span>
            <button onClick={cargarPanel}>Actualizar ahora</button>
            <div className="admin-badge">
              <span>{administrador.nombre.charAt(0)}</span>
              <strong>{administrador.nombre}</strong>
            </div>
            <button className="logout-button" onClick={cerrarSesion}>Salir</button>
          </div>
        </header>

        {vistaActual === 'dashboard' && (
          <>
            <section className="dashboard-layout" id="resumen">
              <section className="metric-grid">
                <Metric label="Reservas" value={datos.reservas.length} trend={`${reservasConfirmadas} confirmadas`} />
                <Metric label="Pendientes" value={reservasPendientes} trend="Por revisar" danger />
                <Metric label="Canchas" value={datos.canchas.length} trend={`${canchasEnMantenimiento} en mantenimiento`} />
                <Metric label="Recordatorios" value={datos.recordatorios.length} trend="Listos para enviar" />
              </section>

              <section className="chart-panel">
                <PanelTitle title="Movimiento de reservas" subtitle="Vista operativa del dia" />
                <div className="chart-box">
                  <div className="chart-info">
                    <span>Confirmadas</span>
                    <strong>{reservasConfirmadas}</strong>
                  </div>
                  <div className="chart-info muted-chart">
                    <span>Pendientes</span>
                    <strong>{reservasPendientes}</strong>
                  </div>
                  <div className="fake-chart">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </section>
            </section>

            <section className="single-view">
              <CanchasAgenda
                datos={datos}
                fechaDashboard={fechaDashboard}
                setFechaDashboard={setFechaDashboard}
              />
            </section>
          </>
        )}

        {vistaActual === 'reservas' && (
          <section className="page-grid">
            <ReservasPanel
              datos={datos}
              reservaClienteId={reservaClienteId}
              reservaCanchaId={reservaCanchaId}
              reservaFecha={reservaFecha}
              reservaHoraInicio={reservaHoraInicio}
              reservaHoraFin={reservaHoraFin}
              setReservaClienteId={setReservaClienteId}
              setReservaCanchaId={setReservaCanchaId}
              setReservaFecha={setReservaFecha}
              setReservaHoraInicio={setReservaHoraInicio}
              setReservaHoraFin={setReservaHoraFin}
              crearReserva={crearReserva}
              cancelarReserva={cancelarReserva}
              cambiarEstadoReserva={cambiarEstadoReserva}
            />
            <ClientesRapidos
              clientes={datos.clientes}
              clienteNombre={clienteNombre}
              clienteTelefono={clienteTelefono}
              clienteBusqueda={clienteBusqueda}
              setClienteNombre={setClienteNombre}
              setClienteTelefono={setClienteTelefono}
              setClienteBusqueda={setClienteBusqueda}
              crearCliente={crearCliente}
            />
          </section>
        )}

        {vistaActual === 'canchas' && (
          <section className="page-grid">
            <section className="work-panel" id="canchas">
            <PanelTitle title="Canchas" subtitle="Estado de espacios" />
            <form className="inline-form" onSubmit={crearCancha}>
              <input placeholder="Nombre" value={canchaNombre} onChange={(evento) => setCanchaNombre(evento.target.value)} />
              <select value={canchaTipoId} onChange={(evento) => setCanchaTipoId(evento.target.value)}>
                <option value="">Tipo</option>
                {datos.tiposCancha.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                ))}
              </select>
              <input placeholder="Precio" type="number" value={canchaPrecio} onChange={(evento) => setCanchaPrecio(evento.target.value)} />
              <button type="submit">Agregar</button>
            </form>
            <div className="stack-list">
              {datos.canchas.length === 0 && <p className="empty-text">No hay canchas activas.</p>}
              {datos.canchas.map((cancha) => (
                <div className="list-row" key={cancha.id}>
                  <div>
                    <strong>{cancha.nombre}</strong>
                    <span>{cancha.tipo_cancha}</span>
                  </div>
                  <div className="row-actions">
                    <small>Bs {cancha.precio_por_hora}</small>
                    <button className="table-button" onClick={() => desactivarCancha(cancha.id)}>Desactivar</button>
                  </div>
                </div>
              ))}
            </div>
            </section>
            <section className="work-panel catalog" id="catalogo">
            <PanelTitle title="Tipos de cancha" subtitle="Catalogo dinamico" />
            <form className="inline-form compact-form" onSubmit={crearTipoCancha}>
              <input placeholder="Nuevo tipo de cancha" value={tipoNombre} onChange={(evento) => setTipoNombre(evento.target.value)} />
              <button type="submit">Agregar tipo</button>
            </form>
            <div className="catalog-line">
              {datos.tiposCancha.map((tipo) => (
                <span key={tipo.id}>
                  {tipo.nombre}
                  <button onClick={() => desactivarTipo(tipo.id)}>x</button>
                </span>
              ))}
            </div>
            </section>
          </section>
        )}

        {vistaActual === 'clientes' && (
          <section className="single-view">
            <section className="work-panel" id="clientes">
            <PanelTitle title="Clientes" subtitle="Lista completa de clientes registrados" />
            <form className="inline-form" onSubmit={crearCliente}>
              <input placeholder="Nombre" value={clienteNombre} onChange={(evento) => setClienteNombre(evento.target.value)} />
              <input placeholder="Telefono" value={clienteTelefono} onChange={(evento) => setClienteTelefono(evento.target.value)} />
              <button type="submit">Agregar</button>
            </form>
            <div className="stack-list">
              {datos.clientes.length === 0 && <p className="empty-text">No hay clientes activos.</p>}
              {datos.clientes.map((cliente) => (
                <div className="list-row" key={cliente.id}>
                  <div>
                    <strong>{cliente.nombre}</strong>
                    <span>{cliente.telefono}</span>
                  </div>
                  <div className="row-actions">
                    <small>{cliente.estado}</small>
                    <button className="table-button" onClick={() => desactivarCliente(cliente.id)}>Desactivar</button>
                  </div>
                </div>
              ))}
            </div>
            </section>
          </section>
        )}

        {vistaActual === 'horarios' && (
          <section className="page-grid">
            <section className="work-panel">
              <PanelTitle title="Horario semanal" subtitle="Define dias de atencion y rango permitido" />
              <div className="stack-list">
                {datos.horarios.map((horario) => (
                  <div className="schedule-config-row" key={horario.id}>
                    <strong>{nombreDia(horario.dia_semana)}</strong>
                    <label className="check-line">
                      <input
                        type="checkbox"
                        checked={Boolean(horario.atiende)}
                        onChange={(evento) => actualizarHorario(horario, { atiende: evento.target.checked ? 1 : 0 })}
                      />
                      Atiende
                    </label>
                    <input
                      type="time"
                      step="1800"
                      value={horario.hora_inicio.slice(0, 5)}
                      onChange={(evento) => actualizarHorario(horario, { hora_inicio: evento.target.value })}
                    />
                    <input
                      type="time"
                      step="1800"
                      value={horario.hora_fin.slice(0, 5)}
                      onChange={(evento) => actualizarHorario(horario, { hora_fin: evento.target.value })}
                    />
                  </div>
                ))}
              </div>
            </section>

            <section className="work-panel">
              <PanelTitle title="Fechas sin atencion" subtitle="Bloqueos particulares" />
              <form className="inline-form compact-form" onSubmit={bloquearFecha}>
                <input type="date" value={fechaBloqueada} onChange={(evento) => setFechaBloqueada(evento.target.value)} />
                <input placeholder="Motivo" value={motivoBloqueo} onChange={(evento) => setMotivoBloqueo(evento.target.value)} />
                <button type="submit">Bloquear</button>
              </form>
              <div className="stack-list">
                {datos.fechasBloqueadas.length === 0 && <p className="empty-text">No hay fechas bloqueadas.</p>}
                {datos.fechasBloqueadas.map((fecha) => (
                  <div className="list-row" key={fecha.id}>
                    <div>
                      <strong>{fecha.fecha}</strong>
                      <span>{fecha.motivo || 'Sin motivo'}</span>
                    </div>
                    <button className="table-button" onClick={() => eliminarFechaBloqueada(fecha.id)}>Quitar</button>
                  </div>
                ))}
              </div>
            </section>
          </section>
        )}

        {vistaActual === 'recordatorios' && (
          <section className="single-view">
            <section className="work-panel mini-panel" id="recordatorios">
            <PanelTitle title="Recordatorios" subtitle="Reservas confirmadas dentro de 2 horas" />
            <div className="panel-action">
              <button onClick={procesarRecordatorios}>Procesar recordatorios</button>
            </div>
            <div className="stack-list">
              {datos.recordatorios.length === 0 && (
                <p className="empty-text">No hay recordatorios pendientes.</p>
              )}
              {datos.recordatorios.map((recordatorio) => (
                <div className="list-row" key={recordatorio.id}>
                  <div>
                    <strong>{recordatorio.cliente}</strong>
                    <span>{recordatorio.cancha} - {recordatorio.hora_inicio}</span>
                  </div>
                  <small>{recordatorio.telefono_cliente}</small>
                </div>
              ))}
            </div>
            </section>
          </section>
        )}

        {vistaActual === 'whatsapp' && (
          <section className="single-view">
            <section className="work-panel mini-panel" id="whatsapp">
            <PanelTitle title="WhatsApp" subtitle="Simulador de solicitud por mensaje" />
            <div className="qr-panel">
              {whatsappQr ? (
                <img className="qr-image" src={whatsappQr} alt="QR de WhatsApp" />
              ) : (
                <div className="fake-qr">QR</div>
              )}
              <div>
                <strong>Conexion del WhatsApp de trabajo</strong>
                <p>Estado: {whatsappEstado}. Escanea el QR con el numero que recibira reservas.</p>
                <div className="qr-actions">
                  <button onClick={iniciarWhatsappReal}>Iniciar WhatsApp</button>
                  <button className="logout-button" onClick={cerrarWhatsappReal}>Cerrar WhatsApp</button>
                  <button className="table-button" onClick={cargarEstadoWhatsapp}>Ver estado</button>
                </div>
              </div>
            </div>
            <form className="inline-form whatsapp-form" onSubmit={simularWhatsapp}>
              <input placeholder="Telefono" value={whatsappTelefono} onChange={(evento) => setWhatsappTelefono(evento.target.value)} />
              <input placeholder="Nombre si es cliente nuevo" value={whatsappNombre} onChange={(evento) => setWhatsappNombre(evento.target.value)} />
              <textarea value={whatsappMensaje} onChange={(evento) => setWhatsappMensaje(evento.target.value)} />
              <button type="submit">Simular mensaje</button>
            </form>
            <div className="bot-response">
              <strong>Respuesta del sistema</strong>
              <p>{whatsappRespuesta || 'Todavia no hay respuesta simulada.'}</p>
            </div>
            </section>
          </section>
        )}

        <footer className="main-footer">
          <span>CanchaYa</span>
          <span>Panel privado de administracion</span>
          <span>{ultimaActualizacion ? `Ultima actualizacion ${ultimaActualizacion}` : 'Esperando datos'}</span>
        </footer>
      </section>
    </main>
  );
}

function obtenerTituloVista(vista: Vista) {
  const titulos = {
    dashboard: 'Dashboard',
    reservas: 'Gestion de reservas',
    canchas: 'Gestion de canchas',
    clientes: 'Gestion de clientes',
    horarios: 'Horarios de atencion',
    recordatorios: 'Recordatorios',
    whatsapp: 'WhatsApp'
  };

  return titulos[vista];
}

function nombreDia(dia: number) {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  return dias[dia];
}

function ReservasPanel(props: {
  datos: DatosPanel;
  reservaClienteId: string;
  reservaCanchaId: string;
  reservaFecha: string;
  reservaHoraInicio: string;
  reservaHoraFin: string;
  setReservaClienteId: (valor: string) => void;
  setReservaCanchaId: (valor: string) => void;
  setReservaFecha: (valor: string) => void;
  setReservaHoraInicio: (valor: string) => void;
  setReservaHoraFin: (valor: string) => void;
  crearReserva: (evento: FormEvent<HTMLFormElement>) => void;
  cancelarReserva: (id: number) => void;
  cambiarEstadoReserva: (reserva: Reserva, estado: string) => void;
}) {
  return (
    <section className="work-panel wide" id="reservas">
      <PanelTitle title="Reservas registradas" subtitle="Agenda actual del administrador" />
      <form className="inline-form reservation-form" onSubmit={props.crearReserva}>
        <select value={props.reservaClienteId} onChange={(evento) => props.setReservaClienteId(evento.target.value)}>
          <option value="">Cliente</option>
          {props.datos.clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
          ))}
        </select>
        <select value={props.reservaCanchaId} onChange={(evento) => props.setReservaCanchaId(evento.target.value)}>
          <option value="">Cancha</option>
          {props.datos.canchas.map((cancha) => (
            <option key={cancha.id} value={cancha.id}>{cancha.nombre}</option>
          ))}
        </select>
        <input type="date" value={props.reservaFecha} onChange={(evento) => props.setReservaFecha(evento.target.value)} />
        <input type="time" step="1800" value={props.reservaHoraInicio} onChange={(evento) => props.setReservaHoraInicio(evento.target.value)} />
        <input type="time" step="1800" value={props.reservaHoraFin} onChange={(evento) => props.setReservaHoraFin(evento.target.value)} />
        <button type="submit">Reservar</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Horario</th>
            <th>Cliente</th>
            <th>Cancha</th>
            <th>Estado</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
          {props.datos.reservas.length === 0 && (
            <tr>
              <td colSpan={6} className="empty-cell">No hay reservas registradas.</td>
            </tr>
          )}

          {props.datos.reservas.map((reserva) => (
            <tr key={reserva.id}>
              <td>{reserva.fecha_reserva}</td>
              <td>{reserva.hora_inicio} - {reserva.hora_fin}</td>
              <td>{reserva.cliente}</td>
              <td>{reserva.cancha}</td>
              <td><Status estado={reserva.estado} /></td>
              <td>
                <div className="table-actions">
                  {reserva.estado === 'pendiente' && (
                    <button className="table-button" onClick={() => props.cambiarEstadoReserva(reserva, 'confirmada')}>
                      Confirmar
                    </button>
                  )}
                  {reserva.estado === 'confirmada' && (
                    <button className="table-button" onClick={() => props.cambiarEstadoReserva(reserva, 'finalizada')}>
                      Finalizar
                    </button>
                  )}
                  {!['cancelada', 'finalizada'].includes(reserva.estado) && (
                    <button className="table-button" onClick={() => props.cancelarReserva(reserva.id)}>
                      Cancelar
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function CanchasAgenda(props: {
  datos: DatosPanel;
  fechaDashboard: string;
  setFechaDashboard: (valor: string) => void;
}) {
  return (
    <section className="work-panel">
      <PanelTitle title="Agenda por cancha" subtitle="Horarios reservados segun fecha seleccionada" />
      <form className="inline-form compact-form">
        <input
          type="date"
          value={props.fechaDashboard}
          onChange={(evento) => props.setFechaDashboard(evento.target.value)}
        />
      </form>
      <div className="court-grid">
        {props.datos.canchas.length === 0 && (
          <p className="empty-text">No hay canchas activas.</p>
        )}
        {props.datos.canchas.map((cancha) => {
          const reservasCancha = props.datos.reservas.filter((reserva) => (
            reserva.cancha_id === cancha.id
            && reserva.fecha_reserva === props.fechaDashboard
            && !['cancelada', 'finalizada'].includes(reserva.estado)
          ));

          return (
            <article className="court-card" key={cancha.id}>
              <div>
                <h3>{cancha.nombre}</h3>
                <span>{cancha.tipo_cancha}</span>
              </div>
              {reservasCancha.length === 0 && (
                <p>No tiene horarios reservados.</p>
              )}
              {reservasCancha.map((reserva) => (
                <div className="schedule-row" key={reserva.id}>
                  <strong>{reserva.hora_inicio} - {reserva.hora_fin}</strong>
                  <span>{reserva.cliente}</span>
                </div>
              ))}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ClientesRapidos(props: {
  clientes: Cliente[];
  clienteNombre: string;
  clienteTelefono: string;
  clienteBusqueda: string;
  setClienteNombre: (valor: string) => void;
  setClienteTelefono: (valor: string) => void;
  setClienteBusqueda: (valor: string) => void;
  crearCliente: (evento: FormEvent<HTMLFormElement>) => void;
}) {
  const clientesFiltrados = props.clientes.filter((cliente) => {
    const texto = `${cliente.nombre} ${cliente.telefono}`.toLowerCase();
    return texto.includes(props.clienteBusqueda.toLowerCase());
  });

  return (
    <section className="work-panel">
      <PanelTitle title="Cliente rapido" subtitle="Buscar o registrar sin salir de reservas" />
      <form className="inline-form compact-form" onSubmit={props.crearCliente}>
        <input placeholder="Nombre" value={props.clienteNombre} onChange={(evento) => props.setClienteNombre(evento.target.value)} />
        <input placeholder="Telefono" value={props.clienteTelefono} onChange={(evento) => props.setClienteTelefono(evento.target.value)} />
        <button type="submit">Agregar</button>
      </form>
      <div className="panel-search">
        <input
          placeholder="Buscar por nombre o telefono"
          value={props.clienteBusqueda}
          onChange={(evento) => props.setClienteBusqueda(evento.target.value)}
        />
      </div>
      <div className="stack-list compact-list">
        {clientesFiltrados.length === 0 && <p className="empty-text">No se encontraron clientes.</p>}
        {clientesFiltrados.slice(0, 8).map((cliente) => (
          <div className="list-row" key={cliente.id}>
            <div>
              <strong>{cliente.nombre}</strong>
              <span>{cliente.telefono}</span>
            </div>
            <small>{cliente.estado}</small>
          </div>
        ))}
      </div>
    </section>
  );
}

function Metric(props: { label: string; value: number; trend: string; danger?: boolean }) {
  return (
    <div className="metric-box">
      <span>{props.label}</span>
      <strong>{props.value}</strong>
      <small className={props.danger ? 'danger-trend' : ''}>{props.trend}</small>
    </div>
  );
}

function PanelTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="panel-title">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

function Status({ estado }: { estado: string }) {
  return <span className={`status status-${estado}`}>{estado}</span>;
}

export default App;
