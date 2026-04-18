const logger = require('../helpers/logger');

/**
 * HTTP request/response logger middleware.
 * Logs: method, path, status code, response time, IP.
 * Automatically covers every API — no changes needed in controllers.
 */
module.exports = function requestLogger(req, res, next) {
  const start = Date.now();
  const ip    = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '-';

  res.on('finish', () => {
    const ms      = Date.now() - start;
    const status  = res.statusCode;
    const level   = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info';

    logger[level](
      `${req.method} ${req.originalUrl} ${status} ${ms}ms — IP: ${ip} — User: ${req.user?.id ?? 'guest'}`
    );
  });

  next();
};
