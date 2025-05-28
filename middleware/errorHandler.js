const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Si el error tiene un código de estado, lo usamos; si no, usamos 500
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    success: false,
    message,
    // Solo incluir el stack trace en desarrollo
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler; 