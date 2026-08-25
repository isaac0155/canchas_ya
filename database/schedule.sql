USE canchaya_db;

CREATE TABLE IF NOT EXISTS horario_atencion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dia_semana TINYINT NOT NULL,
  atiende BOOLEAN NOT NULL DEFAULT TRUE,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  CHECK (dia_semana BETWEEN 0 AND 6),
  CHECK (hora_fin > hora_inicio),
  UNIQUE (dia_semana)
);

CREATE TABLE IF NOT EXISTS fecha_bloqueada (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fecha DATE NOT NULL UNIQUE,
  motivo VARCHAR(150),
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO horario_atencion (dia_semana, atiende, hora_inicio, hora_fin)
VALUES
  (0, TRUE, '08:00:00', '22:00:00'),
  (1, TRUE, '08:00:00', '22:00:00'),
  (2, TRUE, '08:00:00', '22:00:00'),
  (3, TRUE, '08:00:00', '22:00:00'),
  (4, TRUE, '08:00:00', '22:00:00'),
  (5, TRUE, '08:00:00', '22:00:00'),
  (6, TRUE, '08:00:00', '22:00:00')
ON DUPLICATE KEY UPDATE
  dia_semana = VALUES(dia_semana);
