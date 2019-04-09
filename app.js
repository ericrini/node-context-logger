const ContextLogger = require('./ContextLogger');

// Note that this is a singleton.
const logger = new ContextLogger();

// Create call stack "A". Think of this as an incoming request.
setTimeout(function () {
  logger.set("requestId", "A");
  logger.log("begin");

  setTimeout(function () {
    logger.log("end");
  }, 0);
}, 0);

// Create call stack "B". Think of this as an incoming request.
setTimeout(function () {
  logger.set("requestId", "B");
  logger.log("begin");

  setTimeout(function () {
    logger.log("end");
  }, 0);
}, 0);

// Create call stack "C". Think of this as an incoming request.
setTimeout(function () {
  logger.set("requestId", "C");
  logger.log("begin");

  // Let's have some fun...
  setTimeout(function () {
    logger.log("database call 1");

    setTimeout(function () {
      logger.log("database call 2");

      setTimeout(function () {
        logger.log("end");
      }, 0);
    }, 0);
  }, 0);
}, 0);
