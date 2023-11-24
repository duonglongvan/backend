const clickhouse = require("../utils/clickhouse");
const util = require("../utils/util");
const updateModel = require("./update");
const CUSTOMER_ID = 1;
let timeUpdateEvent = 0;
let timeUpdateLogs = 0;
class JMonitoringService {
  constructor(req) {
    this.updateTotal(req);
  }
  getModelUser() {
    const CustomerSchema = require("../models/Customer");
    const CustomerModel = mongoose.model("Customer", CustomerSchema, "customer_" + CUSTOMER_ID);
    return CustomerModel;
  }

  async updateTotal(req) {
    const timeIntervalId = setInterval(async () => {
      timeUpdateEvent++;
      if (timeUpdateEvent == 180) {
        const totalEvents = await this.getTotalEvents(req);
        await updateModel.updateDataRawlog("events", totalEvents);
        timeUpdateEvent = 0;
      }
      timeUpdateLogs++;
      if (timeUpdateLogs == 185) {
        const totalLogs = await this.getTotalLogs(req);
        await updateModel.updateDataRawlog("logs", totalLogs);
        timeUpdateLogs = 0;
      }
    }, 1000);
  }
  /**
   * 
   * @returns 
   */
  async getTotalEvents(req) {
    const timer = await this.getTimeConfig(req);
    let time = Math.floor((Date.now() - timer * 1000) / 1000);
    const table_name = "siem.alerts3";
    const where = " WHERE a.event_time>" + time;
    let sql = "SELECT count() AS total FROM " + table_name + " AS a  " + where;
    let total = await clickhouse.getTotalRow(sql);
    return total;
  }

  async getTotalLogs(req) {
    const timer = await this.getTimeConfig(req);
    let time = Math.floor((Date.now() - timer * 1000) / 1000);
    let condition = {},
      condition1 = {};
    condition.ts_created_at = {
      $gte: time
    };
    condition1 = condition;
    // if (lastUpdate > 0) {
    //   condition1.ts_created_at = {
    //     $gte: lastUpdate
    //   };
    // }
    let sort = {
      ts_created_at: -1
    };
    const CustomerModel = this.getModelUser();
    //logger.info("condition is", condition);
    const total = await CustomerModel.countDocuments(condition);
    return total;
  }
  async get(id, user) {}
  /**
   * 
   * @returns 
   */
  async getEvents(req) {
    let {
      page,
      size
    } = req.query;
    if (!util.isNumeric(page)) {
      JError.setFormat("page");
    }
    if (!util.isNumeric(size)) {
      JError.setFormat("size");
    }

    //logger.trace("this.isNumeric(page) is", this.isNumeric(page));
    page = parseInt(page);
    if (page < 1) page = 1;
    size = parseInt(size);
    if (size < 1) size = 100;
    const offset = (page - 1) * size;
    const result = await this.getDataClickhouse(offset, size, req);
    return {
      data: result.data,
      pagination: {
        total: result.total,
        page: page,
        size: size
      }
    };

  }
  /**
   * 
   * @returns 
   */
  async getFilterEvents(req) {
    let {
      page,
      size
    } = req.query;
    if (!util.isNumeric(page)) {
      page=0;
    }
    if (!util.isNumeric(size)) {
     size=100;
    }
    //logger.trace("this.isNumeric(page) is", this.isNumeric(page));
    page = parseInt(page);
    if (page < 1) page = 1;
    size = parseInt(size);
    if (size < 1) size = 100;
    const offset = (page - 1) * size;
    const result = await this.getDataClickhouse(offset, size, req);
    return {
      data: result.data,
      pagination: {
        total: result.total,
        page: page,
        size: size
      }
    };

  }
  /**
   * 
   * @param {*} lastUpdate 
   * @param {*} offset 
   * @param {*} limit 
   * @returns 
   */
  async getDataClickhouse(offset, limit, req) {
    
    logger.info("[getDataClickhouse] req.body is",req.body);
    const {
      quick_filter,
      filters
    } = req.body;
    const timer = await this.getTimeConfig(req);
    let time = Math.floor((Date.now() - timer * 1000) / 1000);
    const table_name = "siem.alerts3";
    let where = " WHERE a.event_time>" + time;
    logger.info("filters is",filters);
    if (filters && filters.length>0) {
      const whFilter = filters.map(e => {
        return "a." + e.field + e.operator + "'" + e.value + "'";
      });
      logger.info("whFilter is",whFilter);
      const strWhere = whFilter.join(" AND ");
      if (strWhere) where = where + " AND " + strWhere;
    }
    if (quick_filter) {
      //dst_ip || source_ip || machine_name || match_window_rule || matched_single_rule || matched_single_rule
      where = where + " AND(( a.dst_ip LIKE '%" + quick_filter + "%')OR ( a.source_ip LIKE  '%" + quick_filter + "%') OR (a.machine_name LIKE  '%" + quick_filter + "%')";
      where = where + " OR( a.match_window_rule LIKE '%" + quick_filter + "%')OR (a.matched_single_rule LIKE '%" + quick_filter + "%') OR (a.matched_single_rule LIKE  '%" + quick_filter + "%'))";
    }
    logger.info("where is",where);
    //let where1 = where;
    let sql = "SELECT count() AS total FROM " + table_name + " AS a  " + where;
    let total = await clickhouse.getTotalRow(sql);
    let data = total > 0 ? await clickhouse.query("SELECT a.* FROM " + table_name + " AS a " + where + " ORDER BY a.event_time DESC limit " + offset + "," + limit) : [];
    //logger.info("total is ", total);
    where="";
    return {
      data,
      total
    };
  }
  /**
   * 
   * @param {*} req 
   */
  async getLogs(req) {
    let {
      page,
      size
    } = req.query;
    if (!util.isNumeric(page)) {
      JError.setFormat("page");
    }
    if (!util.isNumeric(size)) {
      JError.setFormat("size");
    }
    page = parseInt(page);
    if (page < 1) page = 1;
    size = parseInt(size);
    if (size < 1) size = 100;
    const offset = (page - 1) * size;
    const result = await this.getDataMongodb(offset, size, req);
    return {
      dataLength: result.data.length,
      data: result.data,
      pagination: {
        total: result.total,
        page: page,
        size: size
      }
    };
  }
  /**
   * 
   * @param {*} req 
   */
  async getFilterLogs(req) {
    let {
      page,
      size
    } = req.query;
    if (!util.isNumeric(page)) {
      page=0;
    }
    if (!util.isNumeric(size)) {
     size=100;
    }
    page = parseInt(page);
    if (page < 1) page = 1;
    size = parseInt(size);
    if (size < 1) size = 100;
    const offset = (page - 1) * size;
    const result = await this.getDataMongodb(offset, size, req);
    return {
      dataLength: result.data.length,
      data: result.data,
      pagination: {
        total: result.total,
        page: page,
        size: size
      }
    };
  }
  /**
   * 
   * @param {*} condition 
   * @param {*} sort 
   * @param {*} offset 
   * @param {*} limit 
   */
  async getDataMongodb(offset, limit, req) {
    const {
      quick_filter,
      filters
    } = req.body;
    const CustomerModel = this.getModelUser();
    const timer = await this.getTimeConfig(req);
    logger.info("timer is", timer);
    let time = Date.now() - timer * 1000;
    let  condition1 = {},
    conditionnQuick = {},
    arrcondition={};
      condition1.ts_created_at = {
      $gte: time
    };
    if (filters) {
      const conditionFilter = filters.map(e => {
        return this.setFilterMongodb(e);
      });
       arrcondition ={$and: conditionFilter};
    }
    if (quick_filter) {
      //id || ip || customer_id || src_ip || dst_ip || machine_id     
      const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
      const searchRgx = rgx(quick_filter);
       const conditions=[{id:{ $regex: searchRgx, $options: "i" }},
       {ip:{ $regex: searchRgx, $options: "i" }},{customer_id:{ $regex: searchRgx, $options: "i" }},{src_ip:{ $regex: searchRgx, $options: "i" }},
       {dst_ip:{ $regex: searchRgx, $options: "i" }},{machine_id:{ $regex: searchRgx, $options: "i" }}];
      conditionnQuick={$or:conditions}
   }
    let sort = {
      ts_created_at: -1
    };
    const condition={$and:[condition1,arrcondition,conditionnQuick]};
    logger.info("condition is", condition);
    const total = await CustomerModel.countDocuments(condition);
    logger.info("total is", time, total);
    let result = total > 0 ? await CustomerModel.find(condition).sort(sort).skip(offset).limit(limit) : [];
    //logger.info("data is",result);
    return {
      data: result,
      total: total
    };
  }
  /**
   * 
   * @param {*} item 
   * @returns 
   */
  setFilterMongodb(item) {
    const condition = {};
    switch (item.operator) {
      case '>':
        condition[item.field] = {
          $gt: item.value
        };
        break;
      case '>=':
        condition[item.field] = {
          $gte: item.value
        };
        break;
      case '<':
        condition[item.field] = {
          $lt: item.value
        };
        break;
      case '<=':
        condition[item.field] = {
          $lte: item.value
        };
        break;
      case '!=':
        condition[item.field] = {
          $ne: item.value
        };
        break;
      default:
        condition[item.field] = {
          $eq: item.value
        };
    }
    return condition;
  }
  /**
   * 
   * @param {*} config 
   * @param {*} offset 
   * @param {*} size 
   */
  async getDataFromCache(config, offset, size) {
    let keycache = Cache.createKey('raw-log');
    let total = await Cache.getTatalList(keycache);
    const data = await Cache.gets(keycache, offset, size);
    return {
      data,
      total
    };
  }
  /**
   * 
   * @param {*} config 
   * @returns 
   */
  async getTimeConfig(req) {
    const config = await util.getConfig(req);
    let time = config.interval.time;
    switch (config.interval.unit) {
      case "m":
        time = time * 60;
        logger.trace("time minus ", time, 's');
        break;
      case "h":
        time = time * 60 * 60;
        logger.trace("time hour ", time, 's');
        break;
      case "d":
        time = time * 60 * 60 * 24;
        logger.trace("time day ", time, 's');
        break;
      case "w":
        time = time * 60 * 60 * 24 * 7;
        logger.trace("time week ", time, 's');
        break;
      case "M":
        time = time * 60 * 60 * 24 * 30;
        logger.trace("time month ", time, 's');
        break;
      case "y":
        time = time * 60 * 60 * 24 * 365;
        logger.trace("time year ", time, 's');
        break;
    }
    return time;
  }
  /**
   * 
   * @param {*} req 
   */
  async getTest(req) {
    let {
      topic,
      limit,
      offset,
      lastUpdate,
      sort
    } = req.query;
    if (!offset) offset = 0;
    else offset = parseInt(offset) + 1;
    if (!limit || limit < 1) limit = 50;
    else limit = parseInt(limit);
    if (!topic) topic = 'raw-log';
    const key = Cache.createKey(topic + ".*");
    logger.trace("key", key);
    //Cache.scanner(key,limit);
    //Cache.getData(key,limit);
    limit = offset + limit;
    clickhouse.showAllDatabase();
    const data = await Cache.gets(key, offset, limit);
    return {
      data: data,
      pagination: {
        total: data.length,
        offset: offset,
        limit: limit
      }
    };
  }
  /**
   * 
   * @param {*} condition 
   * @param {*} sort 
   * @param {*} offset 
   * @param {*} limit 
   */
  async find(condition, sort, offset, limit) {
    let result;
    if (offset > 0) {
      result = await CustomerModel.find(condition).sort(sort).offset(offset).limit(limit)
    } else {
      result = await CustomerModel.find(condition).sort(sort).limit(limit);
    }
    return result;
  }
  /**
   * 
   * @param {*} name 
   * @param {*} user 
   * @returns 
   */
  async create(name, user) {

  }
  /**
   * 
   * @param {*} id 
   * @param {*} name 
   * @param {*} user 
   * @returns 
   */
  async update(id, name, user) {

  }

  async delete(id, user) {

  }
}
module.exports = new JMonitoringService();
