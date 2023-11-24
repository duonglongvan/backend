const {
  createClient
} = require('@clickhouse/client');
const {
  ClickHouse
} = require('clickhouse');
let clickhouseClient;
let clickhouseConn;
let querySql="";
class JClickhouse {
  initIalize() {
    try {
      clickhouseClient = createClient({
        host: process.env.CLICKHOUSE_HOST ?? 'http://172.16.200.213:30002',
        username: process.env.CLICKHOUSE_USER ?? 'default',
        password: process.env.CLICKHOUSE_PASSWORD ?? '',
      });
      if (clickhouseClient) {
        logger.trace("Connection clickhouse client successful!");
      }
      this.connect();
    } catch (err) {
      logger.error(err.message);
    }
  }
  /**
   * 
   */
  async connect() {
    const option = {
      url: process.env.CLICKHOUSE_HOST,
      port: process.env.CLICKHOUSE_PORT,
      debug: false,
      basicAuth: {
        username: process.env.CLICKHOUSE_USER ?? 'default',
        password: process.env.CLICKHOUSE_PASSWORD ?? '',
      }
    }
     clickhouseConn = new ClickHouse(option);
    if (clickhouseConn) {
      logger.trace("Connection clickhouse successful!");
    }
  }
  
  /**
   * showAllDatabase
   */
  async showAllDatabase() {
    try {
      await clickhouseConn.query('SHOW DATABASES').exec((err, rows) => {
        logger.info("DATABASES is", rows);
      });
    } catch (err) {
      logger.error(err.message);
    }
  }
  /**
   * 
   * @param {*} dbname 
   */
  async showAllTable(dbname) {
    try {
      await clickhouseConn.query('SHOW TABLES FROM '+dbname).exec((err, rows) => {
        logger.info("DATABASES is", rows);
      });
    } catch (err) {
      logger.error(err.message);
    }
  }
  /**
   * 
   */
  async query(sql="") {
    if(sql){
      const resultSet =await clickhouseConn.query(sql).toPromise()
       return resultSet;
    }
  }
  /**
   * 
   * @param {*} sql 
   * @returns 
   */
  async getTotalRow(sql){
    const rows= await clickhouseConn.query(sql,{
      params: {
        ver: 1
      },
    }).toPromise();
    return rows?rows[0]?.total:0;
  }
  /**
   * 
   * @param {*} sql 
   * @returns 
   */
  async queryStream(sql="") {
    if(sql){
      const resultSet = await clickhouseConn.query(sql)
      const stream = resultSet.stream();
      const data = [];
      stream.on('data', (rows) => {
        data.push(rows);
      })
      return await new Promise((resolve) => {
        stream.on('end', () => {
          resolve(data)
        })
      })
    }
  }
  /**
   * 
   * @param {*} select 
   */
  select(select){
    querySql="SELECT "+select;
  }
  /**
   * 
   * @param {*} from 
   */
  from(from){
    querySql=querySql+" FROM "+from; 
  }
  /**
   * 
   * @param {*} where 
   */
  where(where){
    querySql=querySql+" WHERE "+where; 
  }
  /**
   * 
   * @param {*} start 
   * @param {*} limit 
   */
  limit(start,limit){
    if(!start) 
      querySql=querySql+" LIMIT "+limit;
    else {      
      querySql=querySql+" LIMIT "+start+","+limit;
    }      
  }
}
module.exports = new JClickhouse();
