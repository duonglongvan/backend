// db.js
const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config({ path: `./.env` });
class JMariadb{
    constructor(){
      return this.initIalize();
    }
    initIalize(){
      const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'mariadb',
        logging: false,
      });
      
      // Test the connection
      db.authenticate()
        .then(() => {
          logger.info('Connection to MariaDB has been established successfully.');
        })
        .catch((error) => {
          logger.error('Unable to connect to MariaDB:', error);
        });
        return db;
    }
}
// Create a new Sequelize instance with the database configuration


module.exports = new JMariadb();
