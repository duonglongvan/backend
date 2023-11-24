const CONSTANTS = require("../utils/constant");
const MonitoringService = require("../services/monitoring-service");
const response = require("../utils/response");
class JMonitoringController {
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    async config(req, res) {
        try {
            logger.info("req.body is",req.body);
            let config = req.body;
            if(!config){
                config ={interval:{time:5,unit:"m"}};
            }
            const keyConfig = Cache.createKey("config");
            const result = await Cache.set(keyConfig, config);
            logger.trace("result is", result);
            response.success(config, res);
        } catch (err) {
            response.error(err, res);
        }
    }
    /**
     * @getCode
     * @param {*} req 
     * @param {*} res 
     */
    get(req, res) {
        try {
            // response.setPagination(10,0,50);
            const data = MonitoringService.get(req.params.id, req.user);
            if (!data) {
                JError.notExitsData();
            }
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
            const rc = await MonitoringService.getEvents(req);
            if (!rc.data) {
                JError.notExitsData();
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
            logger.info("[GET] EVENT is start", req.query);
            const rc = await MonitoringService.getFilterEvents(req);
            if (!rc.data) {
                JError.notExitsData();
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
    async getLogs(req,res){
        try {
            logger.info("[GET] LOGS is start", req.query);            
           
            const rc = await MonitoringService.getLogs(req);
            if (!rc.data) {
                JError.notExitsData();
            }
            response.page(rc.pagination.total, rc.pagination.offset, rc.pagination.limit);
            response.success(rc.data, res,{dataLength:rc.dataLength});
        } catch (err) {
            logger.error(err);
            response.error(err, res);
        }
    }
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    async getFilterLogs(req,res){
        try {
            logger.info("[GET] LOGS is start", req.query);            
           
            const rc = await MonitoringService.getFilterLogs(req);
            if (!rc.data) {
                JError.notExitsData();
            }
            response.page(rc.pagination.total, rc.pagination.offset, rc.pagination.limit);
            response.success(rc.data, res,{dataLength:rc.dataLength});
        } catch (err) {
            logger.error(err);
            response.error(err, res);
        }
    }
}
module.exports = new JMonitoringController();