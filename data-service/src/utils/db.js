// db.js
const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config({
  path: `./.env`
});
const DB_SQUELIZE=  new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mariadb',
  logging: false,
  dialectOptions: {
    socketPath: process.env.db_socket,
    timezone: process.env.db_timezone
  },
  pool: {
    min: 0,
    max: 5,
    idle: 100000
  },
  define: {
    charset: 'utf8',
    timestamps: false
  },
  benchmark: false,
  logging: false
});

// Test the connection
DB_SQUELIZE.authenticate()
  .then(() => {
    logger.info('Connection to MariaDB has been established successfully.');
  })
  .catch((error) => {
    logger.error('Unable to connect to MariaDB:', error);
  });
module.exports =  DB_SQUELIZE;
