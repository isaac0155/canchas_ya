# CanchaYa - Contexto del proyecto

## Objetivo
Crear un sistema web sencillo para administrar reservas de canchas deportivas.

## Alcance principal
- El cliente realiza solicitudes por WhatsApp.
- El administrador usa una interfaz web.
- No habra panel de cliente.
- No habra login con Google.
- No habra modulo de pagos con QR.
- El sistema debe evitar cruces de horarios en una misma cancha.
- El sistema debe enviar recordatorios por WhatsApp 2 horas antes de la reserva.

## Modulos definidos
1. Login de administrador.
2. Gestion de canchas.
3. Gestion de clientes.
4. Gestion de reservas.
5. Calendario de disponibilidad.
6. Integracion con WhatsApp.
7. Asistencia con IA para interpretar mensajes.
8. Configuracion de horarios de atencion.

## Tecnologias
- Frontend: React, TypeScript, HTML5, CSS3.
- Backend: Node.js, Express.js.
- Base de datos: MySQL.
- Comunicacion: JSON mediante API REST.

## Arquitectura
React SPA -> Express API -> Servicios -> Repositorios -> MySQL

## Reglas importantes de desarrollo
- El codigo debe ser simple y facil de explicar.
- Evitar abstracciones innecesarias.
- Evitar tablas innecesarias.
- Preferir nombres claros antes que codigo demasiado compacto.
- Separar responsabilidades:
  - Rutas: reciben peticiones.
  - Controladores: preparan entrada y salida.
  - Servicios: contienen la logica del negocio.
  - Repositorios: consultan la base de datos.
  - Configuracion: variables globales y conexion.

## Base de datos
Estado: creada en MySQL local.

Nombre:
- canchaya_db

Script:
- database/schema.sql
- database/seed.sql

Tablas propuestas hasta ahora:
- administrador
- cliente
- tipo_cancha
- cancha
- reserva
- horario_atencion
- fecha_bloqueada

Decision:
- El tipo de cancha estara en una tabla separada para que sea dinamico.
- La tabla canchas usara tipo_cancha_id en lugar de guardar el tipo como texto.
- Los nombres de tablas se usaran en singular.
- No se agregara tabla de sesiones al modelo principal.
- Para el login de administrador se priorizara JWT o cookie firmada, evitando una tabla extra de sesion.
- Datos iniciales de tipo_cancha creados: Futbol 5, Futbol 7, Basquet, Voley.
- El administrador inicial no se creara por SQL por ahora. Se definira al implementar login para guardar password_hash correctamente.
- Se agrego database/schedule.sql para horarios de atencion y fechas bloqueadas.
- horario_atencion guarda la configuracion semanal por dia.
- fecha_bloqueada guarda fechas concretas en las que no se atendera.

## Credenciales locales conocidas
- MySQL usuario: root.
- MySQL password: vacio.

## Pendiente inmediato
1. Preparar datos demo opcionales.
2. Mejorar edicion de registros existentes.
3. Mejorar interpretacion de lenguaje natural.

## Backend
Estado: estructura base creada.

Carpeta:
- backend

Puerto:
- 3001

Dependencias principales:
- express
- mysql2
- dotenv
- cors
- cookie-parser
- jsonwebtoken
- bcryptjs

Estructura:
- src/config
- src/routes
- src/controllers
- src/services
- src/repositories

Endpoints probados:
- GET /api/salud
- GET /api/tipos-cancha
- GET /api/tipos-cancha/:id
- POST /api/tipos-cancha
- PUT /api/tipos-cancha/:id
- DELETE /api/tipos-cancha/:id
- GET /api/canchas
- GET /api/canchas/:id
- POST /api/canchas
- PUT /api/canchas/:id
- DELETE /api/canchas/:id
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/perfil
- GET /api/clientes
- GET /api/clientes/:id
- POST /api/clientes
- PUT /api/clientes/:id
- DELETE /api/clientes/:id
- GET /api/reservas
- GET /api/reservas/:id
- POST /api/reservas
- PUT /api/reservas/:id
- DELETE /api/reservas/:id
- GET /api/recordatorios/pendientes
- POST /api/recordatorios/procesar
- POST /api/whatsapp/mensaje
- GET /api/whatsapp/estado
- POST /api/whatsapp/iniciar
- POST /api/whatsapp/cerrar
- GET /api/horarios
- PUT /api/horarios/:diaSemana
- POST /api/horarios/fechas-bloqueadas
- DELETE /api/horarios/fechas-bloqueadas/:id

Rutas publicas:
- GET /api/salud
- POST /api/auth/login
- POST /api/whatsapp/mensaje

Rutas protegidas:
- POST /api/auth/logout
- GET /api/auth/perfil
- /api/tipos-cancha
- /api/canchas
- /api/clientes
- /api/reservas
- /api/recordatorios
- /api/horarios
- GET /api/whatsapp/estado
- POST /api/whatsapp/iniciar
- POST /api/whatsapp/cerrar

Decision:
- El backend usa JavaScript sencillo para que el codigo sea facil de explicar.
- El puerto del backend sera 3001 porque el puerto 3000 ya estaba ocupado.
- El CRUD de tipo_cancha ya esta implementado.
- DELETE de tipo_cancha no elimina fisicamente el registro, solo cambia estado a inactivo.
- La API responde en JSON cuando recibe un cuerpo JSON invalido.
- El CRUD de cancha ya esta implementado.
- DELETE de cancha no elimina fisicamente el registro, solo cambia estado a inactiva.
- Para crear o actualizar una cancha, tipo_cancha_id debe existir y estar activo.
- El login de administrador ya esta implementado con JWT en cookie HTTP-only.
- No se creo tabla de sesion.
- Existe middleware verificarAdmin en src/middlewares/auth.middleware.js.
- Existe script para crear administradores: npm run crear-admin -- "Nombre" email password.
- El CRUD de cliente ya esta implementado.
- El telefono del cliente es unico porque identifica al cliente por WhatsApp.
- DELETE de cliente no elimina fisicamente el registro, solo cambia estado a inactivo.
- El CRUD de reserva ya esta implementado.
- DELETE de reserva no elimina fisicamente el registro, solo cambia estado a cancelada.
- Para crear o actualizar una reserva se valida que cliente y cancha existan y esten activos.
- Una reserva se considera cruzada cuando hora_inicio < nueva_hora_fin y hora_fin > nueva_hora_inicio.
- Las reservas canceladas y finalizadas no bloquean horarios.
- GET /api/reservas permite filtros opcionales: fecha_reserva, cancha_id, estado.
- El backend acepta horas en formato HH:mm y HH:mm:ss para actualizar reservas.
- Las rutas administrativas ya estan protegidas con verificarAdmin.
- Sin cookie valida, las rutas protegidas responden 401 No autenticado.
- El modulo simple de recordatorios ya esta implementado.
- Los recordatorios usan la tabla reserva y el campo recordatorio_enviado.
- GET /api/recordatorios/pendientes lista reservas confirmadas dentro de las proximas 2 horas.
- POST /api/recordatorios/procesar simula el envio por consola y marca recordatorio_enviado = TRUE.
- La integracion simulada de WhatsApp ya esta implementada.
- POST /api/whatsapp/mensaje recibe telefono, nombre opcional y mensaje.
- Si el telefono no existe y no llega nombre, pide registrar al cliente.
- Si el telefono no existe y llega nombre, registra al cliente.
- Interpreta mensajes simples con fecha YYYY-MM-DD, dos horas HH:mm y tipo de cancha.
- Tambien interpreta "hoy", "mañana/manana" y rangos simples como "de 7 a 9".
- Si el cliente pide reservar pero no menciona fecha, el sistema asume hoy para ahorrar uso de Gemini.
- Si no hay AM/PM y la hora es menor a 12, se asume horario de noche para reservas por WhatsApp.
- Las reservas creadas desde WhatsApp quedan confirmada por defecto.
- Si existe cruce de horario, devuelve error y no registra la reserva.
- Si el cliente indica fecha y hora pero no indica cancha, no se reserva una cancha al azar; se pregunta el tipo de cancha.
- Mensajes como "hola quiero reservar..." no abren el menu, se tratan como solicitud de reserva.
- El sistema guarda un contexto de conversacion en memoria por telefono.
- El contexto indica la accion actual, por ejemplo reservar, y los datos de reserva ya obtenidos.
- El contexto permite saber que falta: fecha, hora o tipo de cancha.
- Si luego el cliente responde "Futbol 7 porfa" o "Futbol 5 porfa", el sistema completa la fecha y hora del contexto.
- Cuando el sistema ya tiene fecha, hora y cancha, no crea la reserva directamente.
- Antes de guardar, muestra un resumen y pide confirmacion al cliente.
- Antes de pedir confirmacion, valida que exista una cancha activa del tipo solicitado.
- Antes de pedir confirmacion, valida horario de atencion, bloque de media hora y cruce de reserva.
- Comandos de confirmacion:
  - confirmar, si, ok o dale: intenta crear la reserva.
  - cambiar: permite corregir fecha, horario o cancha antes de guardar.
  - cancelar: abandona la solicitud y limpia el contexto.
- La memoria de conversacion es temporal; si se reinicia el backend se pierde.
- Se normalizan tildes para reconocer mensajes como "Fútbol 7".
- Las opciones de cancha en WhatsApp se generan desde canchas activas reales.
- Si hay tipos de cancha creados pero no tienen canchas activas, no se ofrecen al cliente.
- Actualmente reconoce Wally en mensajes de WhatsApp.
- Si no puede entender fecha u horas con codigo simple, usa Gemini como apoyo.
- Gemini se configura con GEMINI_API_KEY en backend/.env y no debe guardarse en el codigo.
- Para ahorrar uso de Gemini, primero se intenta interpretar con reglas simples.
- Para ahorrar uso de Gemini, tambien existe un menu textual de WhatsApp.
- El menu responde a "hola", "hola buenas", "menu", "menú" e "inicio".
- Opciones del menu:
  - 1: inicia el recorrido guiado para crear una reserva.
  - 2: lista canchas activas.
  - 3: lista horarios de atencion.
- Se agrego integracion real con whatsapp-web.js.
- El admin puede iniciar WhatsApp desde el panel, ver el QR, consultar estado y cerrar la sesion.
- El servicio real responde mensajes entrantes usando la misma logica del simulador.
- El servicio real ignora mensajes antiguos para no responder chats pendientes al iniciar WhatsApp.
- El servicio real solo atiende mensajes entrantes, con texto, del dia actual y posteriores al inicio del servicio de WhatsApp.
- El servicio real ignora mensajes enviados por el propio numero del administrador.
- Las reservas solo pueden estar dentro del horario de atencion configurado.
- Las reservas solo pueden iniciar o terminar en horas exactas o medias horas.
- Las fechas bloqueadas no aceptan reservas.

Credenciales de desarrollo:
- email: admin@canchaya.com
- password: Admin123
- La contrasena esta guardada en MySQL como bcrypt hash.

## Frontend
Estado: estructura base creada.

Carpeta:
- frontend

Puerto:
- 5173

Tecnologias:
- React
- TypeScript
- Vite
- HTML5
- CSS3

Pantallas creadas:
- Login de administrador.
- Panel base con resumen de reservas, canchas, clientes y tipos de cancha.
- Rediseño del panel con menu superior, dashboard operativo y footer.
- Rediseño ajustado con menu lateral oscuro segun referencia visual.
- Formularios frontend para crear tipo_cancha, cancha, cliente y reserva.
- Acciones frontend para desactivar tipo_cancha, cancha, cliente y cancelar reserva.
- Panel frontend para ver y procesar recordatorios pendientes.
- Navegacion interna por vistas: dashboard, canchas, clientes, tipos, recordatorios y WhatsApp.
- Navegacion reorganizada: dashboard, reservas, canchas, clientes, recordatorios y WhatsApp.
- Dashboard muestra resumen y agenda por cancha segun fecha.
- Reservas tiene gestion de reservas y gestion rapida de clientes.
- Canchas tiene gestion de canchas y tipos de cancha.
- Vista WhatsApp tiene simulador de mensaje y muestra respuesta del sistema.
- Vista Horarios permite configurar dias de atencion, hora inicio, hora fin y fechas bloqueadas.
- Vista WhatsApp permite iniciar WhatsApp real, ver QR, cerrar sesion y usar el simulador.

Decision:
- El frontend consume la API usando /api.
- En desarrollo, Vite usa proxy para enviar /api al backend local.
- El frontend usa credentials: include para enviar cookies HTTP-only al backend.
- El primer frontend es simple y esta en pocos archivos para que sea facil de explicar.
- El panel administrativo usa menu lateral oscuro inspirado en la referencia visual entregada por el usuario.
- El dashboard se actualiza automaticamente cada 10 segundos usando polling.
- El footer debe estar visible al final del panel.
- La interfaz no debe mostrar la URL del backend ni tecnologias internas como dato visible.
- Login y panel administrativo deben compartir la misma linea visual.
- El dashboard no debe estar cargado con todos los CRUD.
- El dashboard muestra resumen y tarjetas de canchas con horarios reservados por fecha.
- La gestion de reservas va en su propia vista.
- La gestion rapida de clientes tambien aparece en reservas para agilizar trabajo del admin.
- La gestion completa de clientes sigue en su vista propia.
- La gestion de tipos de cancha queda dentro de la vista Canchas.
- Las reservas creadas por admin desde frontend se crean como confirmada por defecto.

Verificaciones:
- npm run build ejecutado correctamente.
- GET http://localhost:5173 responde 200.
- GET http://localhost:3001/api/salud responde correctamente.
- POST http://localhost:3001/api/auth/login acepta Origin http://localhost:5173, devuelve cookie y permite credentials.
- Rediseño del frontend compilado correctamente con npm run build.
- GET http://localhost:5173/api/salud responde correctamente mediante proxy de Vite.
- Formularios CRUD principales del frontend compilados correctamente con npm run build.
- Modulo de recordatorios probado: lista pendientes, procesa y deja de listar los ya enviados.
- Separacion de vistas del frontend compilada correctamente con npm run build.
- Reorganizacion de dashboard/reservas/canchas compilada correctamente con npm run build.
- Probado crear reserva confirmada y actualizar estado usando horas HH:mm:ss.
- Simulador de WhatsApp probado: cliente nuevo, reserva confirmada y bloqueo de cruce.
- Probado GET /api/horarios protegido con login.
- Probado GET /api/whatsapp/estado protegido con login.
- GET /api/whatsapp/estado devuelve fechaInicioServicio; cuando WhatsApp esta desconectado es null.
- Probado mensaje "Quiero reservar una cancha de fut para hoy de 7 a 9 porfa"; el parser lo entiende y responde segun disponibilidad.
- Probado rechazo por minutos invalidos: 20:10 a 21:10.
- Probado rechazo fuera de horario de atencion.
- Probado menu de WhatsApp: hola, 1, 2 y 3.
- Probadas variantes del menu: hola buenas, opcion 1 y opción 2.
- Probado mensaje "hola quiero reservar una cancha para las 7 a 9": responde falta_cancha porque entiende hoy y el rango 19:00 a 21:00, pero falta tipo de cancha.
- Probado flujo por pasos: "Quiero para hoy de 9 a 11" y luego "Fútbol 7 porfa"; ya no pide fecha/hora otra vez, intenta completar con la cancha.
- Probado flujo por pasos con "Fútbol 5 porfa"; crea la reserva usando la fecha y hora guardadas.
- Probado recorrido guiado del menu: Hola -> 1 -> hoy -> de 7 a 8 -> Fútbol 5.
- El recorrido guiado conserva contexto y pregunta solo el dato que falta.
- Probado que una reserva por WhatsApp no se crea antes de responder confirmar.
- Probado confirmar con horario libre: crea la reserva.
- Probado cambiar: permite modificar el horario y vuelve a pedir confirmacion.
- Probado cancelar: no crea reserva y limpia la solicitud.
- Probado que si solo existen canchas activas Futbol 5 y Wally, WhatsApp solo ofrece Futbol 5 y Wally.
- Probado que Futbol 7 no pasa a confirmacion si no hay cancha activa de ese tipo.
- Probado que un horario fuera de atencion no pasa a confirmacion.
- Frontend compilado correctamente despues de agregar Horarios y WhatsApp real.
- El backend no tiene script npm test por ahora.
