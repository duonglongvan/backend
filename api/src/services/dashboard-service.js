const MyMonitoringModel = require("../models/db/MyMonitoring");
const CUSTOMER_ID = 1;
const {
  Op
} = require("sequelize");
class JDashboardService {
  /**
   * 
   * @param {*} req 
   */
  async getConfig(req) {
    let config = req.body;
    if(!config){
        config ={date_time:{time:5,unit:"m"}};
    }
    const keyConfig = Cache.createKey("config");
    Cache.set(keyConfig, config);
    return config;
  }
  /**
   * 
   * @param {*} req 
   */
  async gets(req) {
    let {
      page,
      size
    } = req.query;
    if(!size ||size<1) size=8
    const where = {
      total: {
        [Op.gt]: 0
      },
      cus_id: {
        [Op.eq]: CUSTOMER_ID
      }
    }
    const items = await MyMonitoringModel.findAll({
      where: where,
      order: [
        ["id", 'DESC']
      ]
    });
    const obj = {
      raws: [],
      logs: [],
      events: []
    };
    items.map(e => {
      if (e.type == 'raw-log') {
        if (obj.raws.length < size) obj.raws.push(e.total);
      }
      if (e.type == 'logs') {
        if (obj.logs.length < size) obj.logs.push(e.total);
      }
      if (e.type == 'events') {
        if (obj.events.length < size) obj.events.push(e.total);
      }
    });
    return obj;
  }
}
module.exports = new JDashboardService();
