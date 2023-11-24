const RouterMonitoring = express.Router();
const MonitoringController = require("../controllers/monitoring-ctrl");
const ImipMiddle = require("../utils/ImipMiddle");
logger.trace("monitoring route start....");
/**
 * @swagger
 * /api/monitoring/events:
 *   get:
 *     summary: List parsing monitoring
 *     tags: [Monitoring]
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
RouterMonitoring.get("/events",  MonitoringController.getEvents);
/**
 * @swagger
 * /api/monitoring/events/search:
 *   get:
 *     summary: List parsing monitoring
 *     tags: [Monitoring]
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
RouterMonitoring.post("/events/search",  MonitoringController.getFilterEvents);
/**
 * @swagger
 * /api/monitoring/logs:
 *   get:
 *     summary: List Logs monitoring
 *     tags: [Monitoring]
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
RouterMonitoring.get("/logs",  MonitoringController.getLogs);
/**
 * @swagger
 * /api/monitoring/logs/search:
 *   get:
 *     summary: List Logs monitoring
 *     tags: [Monitoring]
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
RouterMonitoring.post("/logs/search",  MonitoringController.getFilterLogs);

module.exports = RouterMonitoring;