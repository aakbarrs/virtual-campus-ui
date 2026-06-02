function errorHandler(err, req, res, _next) {
  console.error(err.stack || err.message);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Terjadi kesalahan internal server'
  });
}

module.exports = errorHandler;
