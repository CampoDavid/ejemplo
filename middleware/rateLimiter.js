const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // límite de 100 peticiones por ventana por IP
    message: {
        success: false,
        message: 'Demasiadas peticiones desde esta IP, por favor intente de nuevo después de 15 minutos'
    },
    standardHeaders: true, // Devolver info de rate limit en los headers `RateLimit-*`
    legacyHeaders: false, // Deshabilitar los headers `X-RateLimit-*`
});

module.exports = rateLimiter; 