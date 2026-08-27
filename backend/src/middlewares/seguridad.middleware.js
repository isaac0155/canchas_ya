const rateLimit = require('express-rate-limit');
const env = require('../config/env');

const limitadorGeneral = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    mensaje: 'Demasiadas peticiones, intenta nuevamente en un momento'
  }
});

const limitadorLogin = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.loginRateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    mensaje: 'Demasiados intentos de login, intenta nuevamente en un momento'
  }
});

module.exports = {
  limitadorGeneral,
  limitadorLogin
};
