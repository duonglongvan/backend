const CONSTANTS = require("../utils/constant");
const DashboardService = require("../services/dashboard-service");
const response = require("../utils/response");
const imip = require("../utils/imip");

class JDashboardController {

  /**
   * 
   * @param {*} req 
   * @param {*} res 
   */
  async getConfig(req, res) {
    try {
      const data = await DashboardService.getConfig(req);
      if (!data) {
        JError.notExitsData();
      }
      response.success(data, res);
    } catch (err) {
      response.error(err, res);
    }
  }
  /**
   * 
   * @param {*} req 
   * @param {*} res 
   */
  async gets(req, res) {
    try {
      const data = await DashboardService.gets(req);
      if (!data) {
        JError.notExitsData();
      }
      response.success(data, res);
    } catch (err) {
      response.error(err, res);
    }
  }
}

module.exports = new JDashboardController();
