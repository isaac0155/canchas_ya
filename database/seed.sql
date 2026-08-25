USE canchaya_db;

INSERT INTO tipo_cancha (nombre)
VALUES
  ('Futbol 5'),
  ('Futbol 7'),
  ('Basquet'),
  ('Voley')
ON DUPLICATE KEY UPDATE
  nombre = VALUES(nombre);
