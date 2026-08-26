USE canchaya_db;

ALTER TABLE reserva
  ADD COLUMN cancelacion_motivo VARCHAR(200) NULL,
  ADD COLUMN resultado VARCHAR(20) NOT NULL DEFAULT 'sin_marcar',
  ADD COLUMN fecha_resultado DATETIME NULL;
