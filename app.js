const ContextLogger = require('./ContextLogger');
const logger = new ContextLogger();

(async function () {
  await logger.beginScope(function (logger) {
    logger.setProperty("requestId", "none");
    logger.logInfo("server up");
  
    logger.beginScope(async function (logger) {
      logger.setProperty("requestId", "A");
      logger.logInfo("Beginning...");
  
      await Promise.resolve().then(function () {
        logger.logInfo("Middle...");
      });
  
      logger.logInfo("End...");
    });
  
    logger.beginScope(async function (logger) {
      logger.setProperty("requestId", "B");
      
      logger.logInfo("Request to GET /something recieved.");
  
      await logger.beginScope(async function (logger) {
        await Promise.resolve().then(async function () {
          logger.setProperty("transactionId", 1);
          logger.logInfo("SELECT * FROM table1;");

          await Promise.resolve().then(function () {
            logger.setProperty("transactionId", 1);
            logger.logInfo("SELECT * FROM table2;");
          });
        });
      });

      await logger.beginScope(async function (logger) {
        await Promise.resolve().then(function () {
          logger.setProperty("transactionId", 2);
          logger.logInfo("SELECT * FROM table3;");
        });
      });
  
      logger.logInfo("HTTP 200 response sent.");
    });
  });
})();
