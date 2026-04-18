const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

const LOG_DIR = path.join(process.cwd(), 'logs');

// ─── Shared format ────────────────────────────────────────────
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.printf(({ timestamp, level, message, stack }) => {
    return stack
      ? `[${timestamp}] ${level.toUpperCase()}: ${message}\n${stack}`
      : `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  })
);

// ─── Rotation config ──────────────────────────────────────────
// New file created daily; files older than 365 days are auto-deleted.
const rotationOptions = {
  dirname:     LOG_DIR,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,          // compress old files to save space
  maxFiles:    '365d',          // delete anything older than 1 year
  format:      logFormat,
};

// ─── Logger ───────────────────────────────────────────────────
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports: [
    // Console — only in development
    ...(process.env.NODE_ENV !== 'production'
      ? [new transports.Console({
          format: format.combine(format.colorize(), logFormat),
        })]
      : []),

    // All logs (info + above)
    new DailyRotateFile({
      ...rotationOptions,
      filename: 'combined-%DATE%.log',
      level:    'info',
    }),

    // Errors only — separate file for quick debugging
    new DailyRotateFile({
      ...rotationOptions,
      filename: 'error-%DATE%.log',
      level:    'error',
    }),
  ],
});

// ─── Override console so existing code routes through Winston ──
// This means every console.error/warn/log across all controllers
// automatically lands in the log files without touching each file.
console.log   = (...args) => logger.info(args.map(String).join(' '));
console.info  = (...args) => logger.info(args.map(String).join(' '));
console.warn  = (...args) => logger.warn(args.map(String).join(' '));
console.error = (...args) => {
  const msg = args.map(a => (a instanceof Error ? a.stack : String(a))).join(' ');
  logger.error(msg);
};

module.exports = logger;
