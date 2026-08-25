const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const env = require('./config/env');
const routes = require('./routes');

const app = express();

app.use(cors({
  origin: env.frontendUrl,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError) {
    return res.status(400).json({
      mensaje: 'El cuerpo de la peticion no tiene un JSON valido'
    });
  }

  next(error);
});

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({
    mensaje: 'Ruta no encontrada'
  });
});

module.exports = app;
