const mariadb = require('mariadb');
const dotenv = require('dotenv');

dotenv.config({ path: `./.env` });
// Create a pool of database connections
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // connectionLimit: process.env.DB_CONNECTION_LIMIT,
});

module.exports = pool;
