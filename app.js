const ContextLogger = require('./ContextLogger');
const logger = new ContextLogger();

(async function () {
  await logger.beginScope(function (logger) {
    logger.setProperty("requestId", "none");
    logger.logInfo("server up");
  
    logger.beginScope(async function (logger) {
      logger.setProperty("requestId", "A");
      logger.setProperty("transactionId", 1);
      logger.logInfo("Request to GET /something recieved.");
  
      await Promise.resolve().then(function () {
        logger.setProperty("transactionId", 2);
        logger.logInfo("SELECT * FROM table;");
      });
  
      logger.logInfo("HTTP 200 response sent.");
    });
  
    logger.beginScope(async function (logger) {
      logger.setProperty("requestId", "B");
      logger.setProperty("transactionId", 1);
      logger.logInfo("Request to GET /something recieved.");
  
      await logger.beginScope(async function (logger) {
        await Promise.resolve().then(function () {
          logger.setProperty("transactionId", 2);
          logger.logInfo("SELECT * FROM table;");
        });
      })
  
      logger.logInfo("HTTP 200 response sent.");
    });

    logger.logInfo("server down");
  });
})();
