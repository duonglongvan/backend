const mariadbIn = require('mariadb');
const dotenv = require('dotenv');
let pool;
dotenv.config({
  path: `./.env`
});
let conn;
class JMariadb {
  constructor() {
    this.createPool();
  }
  /**
   * 
   */
  createPool(){
    pool = mariadbIn.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      // connectionLimit: process.env.DB_CONNECTION_LIMIT,
    });
  }
  // Create a pool of database connections  
  async connection() {
    if (process.env.MARIADB_ENABLE == 'true') {
      if(!pool){
        pool = this.createPool();
      }
      if(!conn) conn = await pool.getConnection();
      if (conn) {
        logger.trace('Connected to mariadb successful!');
        logger.debug("Total connections: ", pool.totalConnections());
        logger.info("Active connections: ", pool.activeConnections());
        logger.trace("Idle connections: ", pool.idleConnections());        
      }
      global.conn = conn;
      return conn;
    }
    return false;
  }
  /**
   * 
   * @param {*} sql 
   * @returns 
   */
  async query(sql) {
    const db = await this.connection();
    if (db) return await db.query(sql);
    return false;
  }
}

//
module.exports = new JMariadb();
