# CanchaYa

Sistema web para administrar reservas de canchas deportivas.

El cliente solicita reservas por WhatsApp y el administrador gestiona todo desde un panel web.

## Tecnologias

- Frontend: React, TypeScript, HTML5, CSS3
- Backend: Node.js, Express
- Base de datos: MySQL
- ORM: TypeORM
- Comunicacion: API REST con JSON

## Estructura

```text
CanchaYa/
  backend/    API REST con Express
  frontend/   Panel web del administrador
  database/   Scripts SQL de la base de datos
```

## Arquitectura

```text
React SPA -> Express API -> Servicios -> Repositorios -> TypeORM -> MySQL
```

## Configuracion

Crear el archivo:

```text
backend/.env
```

Usar como base:

```text
backend/.env.example
```

Variables principales:

```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=canchaya_db
JWT_SECRET=clave_secreta_para_desarrollo
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash
```

## Base de datos

Ejecutar los scripts SQL en MySQL:

```text
database/schema.sql
database/seed.sql
database/schedule.sql
database/reservation_tracking.sql
```

## Instalar dependencias

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

## Iniciar el proyecto

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

URLs:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:3001
```

## Funciones principales

- Login de administrador
- Gestion de clientes
- Gestion de canchas
- Gestion de tipos de cancha
- Gestion de reservas
- Cancelacion de reservas con motivo
- Metricas de asistencia y pago
- Horarios de atencion
- Fechas bloqueadas
- Recordatorios
- Integracion con WhatsApp
- Apoyo con Gemini para interpretar mensajes
