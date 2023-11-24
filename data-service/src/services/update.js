const MyMonitoringModel = require("../models/db/MyMonitoring");
    const {
      Op
    } = require("sequelize");
class JUpdate {
  async updateDataRawlog(type, total) {
   await global.mariadb.connection();
     logger.info("start connection query");
    await this.setData(type,total);
  }
  /**
   * 
   * @param {*} type 
   * @param {*} total 
   */
  async mariadbUpdate(type,total){
    try {
      const sqlInsert = "INSERT INTO my_monitoring(`type`,`cus_id`,`total`,`created_at`) VALUE('" + type + "','" + 1 + "','" + total + "','" + Date.now() + "')";
      await global.mariadb.query(sqlInsert);
      const sqlAll = "SELECT a.* FROM my_monitoring AS a WHERE a.type='" + type + "' ORDER BY a.created_at DESC";
      const listItem = await global.mariadb.query(sqlAll);
      let k = 0;
      const idDel = [];
      for (let item of listItem) {
        k++;
        if (k > 15) {
          idDel.push(item.id);
        }
      }
      if (idDel && idDel.length > 0) {
        const sqlDelete = "DELETE FROM my_monitoring AS a WHERE a.type='" + type + "' and a.id in(" + idDel.join(",") + ")";
        await global.mariadb.query(sqlDelete);
      }
    } catch (err) {
      // Manage Errors
      logger.error(err);
      JError.set(err);
    } finally {
      // Close Connection
      logger.info("end connection query");
      if (global.conn) global.conn.end();
    }
  }
  /**
   * 
   * @param {*} type 
   * @param {*} total 
   * @returns 
   */
  async setData(type, total) {
    
    return new Promise(async (resolve, reject) => {
      //
      //logger.info("[", type, "] update total start", total);
      if (total > 0) {
        const obj = {
          type: type,
          cus_id: 1,
          total: total,
          created_at: Date.now()
        };
        const [created] = await MyMonitoringModel.findOrCreate({
          where: {
            type: {
              [Op.eq]: type
            },
            total: {
              [Op.eq]: total
            }
          },
          defaults: obj
        });
        if (created.isNewRecord) {
          logger.info("created new is success ");
        } else {
          // logger.trace("not created new is success ");
        }
        const status = await this.deleteRow(type);
        resolve(status);
      }
      resolve(false);
    });
  }
  /**
   * 
   * @param {*} type 
   * @returns 
   */
  async deleteRow(type) {
    return new Promise(async (resolve, reject) => {
      const where = {
        type: {
          [Op.eq]: type
        }
      }
      const items = await MyMonitoringModel.findAll({
        where: where,
        order: [
          ["id", 'DESC']
        ]
      });
      const state = items[15];
      if (state) {
        await MyMonitoringModel.destroy({
          where: {
            type: {
              [Op.eq]: type
            },
            created_at: {
              [Op.lt]: state.created_at
            }
          }
        });
        // .then(() => {
        //   console.log("Successfully deleted record.");
        //   resolve(true);
        // }).catch((error) => {
        //   console.error('Failed to delete record : ', error);
        //   resolve(false);
        // });
        resolve(true);
      }
      resolve(false);
    });
  }
}

module.exports = new JUpdate();
