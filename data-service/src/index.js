const dotenv = require('dotenv');
const app = require('./app');
const path = require("path");
global.path = path;
const rootDir = path.resolve(__dirname);
global.rootDir = rootDir;
let server;
// Load the environment variables from the corresponding file
// dotenv.config({ path: `./env/${process.env.NODE_ENV}.env` });
dotenv.config({
  path: `./.env`
});
server = app.listen(process.env.PORT, () => {
  logger.trace(`Listening to port ${process.env.PORT}`);
});
/*
server = app.listen(process.env.PORT, () => {
  logger.info(`Listening to port ${process.env.PORT}`);
});
*/
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
