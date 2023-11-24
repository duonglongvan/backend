const RouterDashboard = express.Router();
const DashboardController = require("../controllers/dashboard-ctrl");
logger.trace("Dashboard route start....");
/**
 * @swagger
 * /api/dashboard/config:
 *   get:
 *     summary: List parsing Dashboard
 *     tags: [Dashboard]
 *     parameters:
 *      - in: query
 *        name: page
 *        schema:
 *           type: integer
 *        description: The number of items to skip before starting to collect the result set
 *      - in: query
 *        name: size
 *        schema:
 *            type: integer
 *        description: The numbers of items to return  
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                type: string
 */
RouterDashboard.get("/config",  DashboardController.getConfig);
/**
 * @swagger
 * /api/dashboard/chart-data:
 *   get:
 *     summary: List parsing Dashboard
 *     tags: [Dashboard]
 *     parameters:
 *      - in: query
 *        name: page
 *        schema:
 *           type: integer
 *        description: The number of items to skip before starting to collect the result set
 *      - in: query
 *        name: size
 *        schema:
 *            type: integer
 *        description: The numbers of items to return  
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                type: string
 */
RouterDashboard.get("/chart-data",  DashboardController.gets);
module.exports = RouterDashboard;