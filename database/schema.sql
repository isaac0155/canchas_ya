CREATE DATABASE IF NOT EXISTS canchaya_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE canchaya_db;

CREATE TABLE IF NOT EXISTS administrador (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'activo',
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (estado IN ('activo', 'inactivo'))
);

CREATE TABLE IF NOT EXISTS cliente (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) NOT NULL UNIQUE,
  estado VARCHAR(20) NOT NULL DEFAULT 'activo',
  fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (estado IN ('activo', 'inactivo'))
);

CREATE TABLE IF NOT EXISTS tipo_cancha (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL UNIQUE,
  estado VARCHAR(20) NOT NULL DEFAULT 'activo',
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (estado IN ('activo', 'inactivo'))
);

CREATE TABLE IF NOT EXISTS cancha (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo_cancha_id INT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  precio_por_hora DECIMAL(10, 2) NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'activa',
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tipo_cancha_id) REFERENCES tipo_cancha(id),
  UNIQUE (nombre),
  CHECK (precio_por_hora >= 0),
  CHECK (estado IN ('activa', 'inactiva', 'mantenimiento'))
);

CREATE TABLE IF NOT EXISTS reserva (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  cancha_id INT NOT NULL,
  fecha_reserva DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
  origen VARCHAR(20) NOT NULL DEFAULT 'whatsapp',
  recordatorio_enviado BOOLEAN NOT NULL DEFAULT FALSE,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES cliente(id),
  FOREIGN KEY (cancha_id) REFERENCES cancha(id),
  UNIQUE (cancha_id, fecha_reserva, hora_inicio),
  CHECK (hora_fin > hora_inicio),
  CHECK (estado IN ('pendiente', 'confirmada', 'cancelada', 'finalizada')),
  CHECK (origen IN ('whatsapp', 'admin'))
);
