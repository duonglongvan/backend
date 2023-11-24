const CONSTANTS = require("../utils/constant");
const RuleService = require("../services/rule-service");
class JRuleController {
    /**
     * @getCode
     * @param {*} req 
     * @param {*} res 
     */
    get(req, res) {
        try {
            // response.setPagination(10,0,50);
            const data = RuleService.get(req.params.id,req.user);
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
    gets(req, res) {
        try {
            const data = RuleService.gets(req);
            if (!data) {
                JError.notExitsData();
            }
            response.success(data, res);
        } catch (err) {
            response.error(err, res);
        }

    }//
    /**
     * @login
     * @param {*} req 
     * @param {*} res
     * return token for client 
     */
    async create(req, res) {
        try {
            const { name } = req.body;
            //check empty name
            if (!name) {
                JError.setEmpty("name");
            }
            //create
            const data = await RuleService.create(name, req.user);
            if (!data) {
                JError.setError({ param1: "not successful" }, CONSTANTS.CODE.code2009)
            }
            response.success(data, res);
        } catch (err) {
            response.error(err, res);
        }
    }
    /**
   * @login
   * @param {*} req 
   * @param {*} res
   * return token for client 
   */
    async update(req, res) {
        try {
            const { name } = req.body;
            //check empty name and id
            if (!name) {
                JError.setEmpty("name");
            }
            if (!req.params.id) {
                JError.setEmpty("id");
            }
            //update
            const data = await RuleService.update(req.params.id, name, req.user);
            if (!data) {
                JError.setError({ param1: "not successful" }, CONSTANTS.CODE.code2009)
            }
            response.success(data, res);
        } catch (err) {
            response.error(err, res);
        }
    }
     /**
   * @login
   * @param {*} req 
   * @param {*} res
   * return token for client 
   */
     async delete(req, res) {
        try {
            //check id
            if (!req.params.id) {
                JError.setEmpty("id");
            }
            //delete
            const data = await RuleService.delete(req.params.id, req.user);
            if (!data) {
                JError.setError({ param1: "not successful" }, CONSTANTS.CODE.code2009)
            }
            response.success(data, res);
        } catch (err) {
            response.error(err, res);
        }
    }
}
module.exports = new JRuleController();