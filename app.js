const ContextLogger = require('./ContextLogger');

// Note that this is a singleton. You could set it up such that this instance could be 
// required directly or obtained via a global getInstance() method.
const logger = new ContextLogger();
logger.set("requestId", "???");
logger.log("root log");

// Create call stack "A". Think of this as an incoming request.
setTimeout(function () {
  logger.set("requestId", "A");
  logger.log("begn");

  setTimeout(function () {
    logger.log("end");
  }, 0);
}, 0);

// Create call stack "B". Think of this as an incoming request.
setTimeout(function () {
  logger.set("requestId", "B");
  logger.log("begin");

  // Let's have some fun...
  setTimeout(function () {
    logger.set("transactionId", "tx-1");
    logger.log("database call 1");

    setTimeout(function () {
      logger.log("database call 2");

      setTimeout(function () {
        logger.log("end");
      }, 0);
    }, 0);
  }, 0);
}, 0);

// Create call stack "C" using an async/await calling convention.
(async function fn() {
  await Promise.resolve().then(async function () {
    logger.set("requestId", "C");
    logger.set("key", "value-1");
    logger.log("begin");

    await Promise.resolve().then(async function () {
      logger.set("key", "value-2");
      logger.log("middle 1");

      await Promise.resolve().then(function () {
        logger.log("middle 2");
      });
    });

    logger.log("end");
  });
})();