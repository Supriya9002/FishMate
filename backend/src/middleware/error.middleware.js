import logger from "../logger/logger.js";
import ApplicationError from "../error/error.applicationError.js";

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApplicationError) {
    logger.warn("ApplicationError", {
      message: err.message,
      statusCode: err.statusCode,
      path: req.originalUrl,
      method: req.method,
    });
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      statusCode: err.statusCode,
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  }

  const statusCode = err.statusCode || 500;
  logger.error("UnhandledError", {
    message: err.message,
    statusCode,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    code: err.code || err.name,
  });

  return res.status(statusCode).json({
    success: false,
    error: err.message || "Server error! Try again later.",
    statusCode,
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    code: err.code || err.name,
    requestId: err?.$metadata?.requestId,
  });
};

export default errorHandler;
