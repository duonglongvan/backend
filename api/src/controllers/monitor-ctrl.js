const CONSTANTS = require("../utils/constant");
const response = require("../utils/response");
const imip = require("../utils/imip");
class JMonitoringController {
  /**
   * 
   * @param {*} req 
   * @param {*} res 
   */
  async createSession(req, res) {
    try {
      logger.info("req.body is", req.body);
      let customerInfo = req.body;
      if (!customerInfo) {
        JError.empty("customer");
      }
      const result = Auth.signToken(customerInfo, global.keySession);
      logger.trace("result is", result);
      const obj = {
        token: result,
        error: null
      };
      response.success(obj, res);
    } catch (err) {
      response.error(err, res);
    }
  }
  /**
   * 
   * @param {*} req 
   * @param {*} res 
   */
  async configSession(req, res) {
    try {
      logger.info("req.body is", req.body);
      const {
        token,
        interval
      } = req.body;
      if (!token) {
        JError.empty("token");
      }
      if (interval < 0) {
        JError.empty("interval");
      }
      let cus= req.customer&& req.customer.customer?req.customer.customer:"";
    if(cus) cus=cus+".";
    const keyConfig = Cache.createKey(cus+"config");
    logger.trace("keyConfig is",keyConfig);
      const config = {
        token: token,
        interval: interval
      };
      const rc = await Cache.set(keyConfig, config);
      logger.info("rc is", rc);
      response.success(config, res);
    } catch (err) {
      response.error(err, res);
    }
  }
  async getOperator(req, res){
    try {
      const data = CONSTANTS.OPERATOR;
      response.success(data, res);
    } catch (err) {
      response.error(err, res);
    }
  }
  /**
   * @get
   * @param {*} req 
   * @param {*} res 
   */
  async getEvents(req, res) {
    try {
      logger.info("[GET] EVENT is start", req.query);
      let url = process.env.DATA_SERVICE_HOST + '/monitoring/events';
      const rc = await imip.get(url, {
        ...req.query
      },{token:req.token});
      if (rc.code != CONSTANTS.CODE.cod2000.key) {
        JError.set({
          param1: rc.param1,
          code: rc.code,
          field: rc.field
        });
      }
      response.page(rc.pagination.total, rc.pagination.offset, rc.pagination.limit);
      response.success(rc.data, res);
    } catch (err) {
      response.error(err, res);
    }
  }
  /**
   * @get
   * @param {*} req 
   * @param {*} res 
   */
  async getFilterEvents(req, res) {
    try {
      logger.info("[FILTER] EVENT is start", req.body);
      let url = process.env.DATA_SERVICE_HOST + '/monitoring/events/search';
      if(req.query.page){
        url+='?page='+req.query.page;
      }
      if(req.query.size){
        if(!req.query.page)
          url+='?size='+req.query.size;
        else 
         url+='&size='+req.query.size;
      }
      const rc = await imip.post(url, {
        ...req.body
      },{token:req.token});
      if (rc.code != CONSTANTS.CODE.cod2000.key) {
        JError.set({
          param1: rc.param1,
          code: rc.code,
          field: rc.field
        });
      }
      response.page(rc.pagination.total, rc.pagination.offset, rc.pagination.limit);
      response.success(rc.data, res);
    } catch (err) {
      response.error(err, res);
    }
  }
  /**
   * 
   * @param {*} req 
   * @param {*} res 
   */
  async getLogs(req, res) {
    try {
      logger.info("[GET] LOGS is start", req.query);
      let url = process.env.DATA_SERVICE_HOST + '/monitoring/logs';
      const rc = await imip.get(url, {
        ...req.query
      },{token:req.token});
     // logger.info("rc", rc);
      if (rc.code != CONSTANTS.CODE.cod2000.key) {
        JError.set({
          param1: rc.param1,
          code: rc.code,
          field: rc.field
        });
      }
      response.page(rc.pagination.total, rc.pagination.offset, rc.pagination.limit);
      response.success(rc.data, res, {
        dataLength: rc.dataLength
      });
    } catch (err) {
      response.error(err, res);
    }
  }
  /**
   * 
   * @param {*} req 
   * @param {*} res 
   */
  async getFilterLogs(req, res) {
    try {
      logger.info("[FILTER] LOGS is start", req.query);
      let url = process.env.DATA_SERVICE_HOST + '/monitoring/logs/search';
      if(req.query.page){
        url+='?page='+req.query.page;
      }
      if(req.query.size){
        if(!req.query.page)
          url+='?size='+req.query.size;
        else 
         url+='&size='+req.query.size;
      }
      const rc = await imip.post(url, {
        ...req.query
      },{token:req.token});
      if (rc.code != CONSTANTS.CODE.cod2000.key) {
        JError.set({
          param1: rc.param1,
          code: rc.code,
          field: rc.field
        });
      }
      response.page(rc.pagination.total, rc.pagination.offset, rc.pagination.limit);
      response.success(rc.data, res, {
        dataLength: rc.dataLength
      });
    } catch (err) {
      response.error(err, res);
    }
  }
}
module.exports = new JMonitoringController();
