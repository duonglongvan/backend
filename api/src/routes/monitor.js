const Routermonitor = express.Router();
const monitorController = require("../controllers/monitor-ctrl");
const ImipMiddle = require("../utils/ImipMiddle");
logger.trace("monitor route start....");
/**
 * @swagger
 * /api/monitor/session/create:
 *   post:
 *     summary: Create session for customer
 *     tags: [monitor-session]
 *     consumes:
 *      - application/json
 *     parameters:
 *      - in: body
 *        name: session
 *        schema:
 *           type: object
 *           properties:
 *              customer:
 *                  type: string
 *              type:
 *                  type: integer
 *        description: The customer info
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  token:
 *                      type: string
 *                  error:
 *                      type: string
 */
Routermonitor.post("/session/create",  monitorController.createSession);
/**
 * @swagger
 * /api/monitor/session/config:
 *   post:
 *     summary: config session for customer
 *     tags: [monitor-session]
 *     consumes:
 *      - application/json
 *     parameters:
 *      - in: body
 *        name: session
 *        schema:
 *           type: object
 *           properties:
 *              token:
 *                  type: string
 *              interval:
 *                  type: object
 *                  properties:
 *                      time:
 *                          type: integer
 *                          default: 30
 *                      unit:
 *                          type: string
 *                          default: m
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                type: string
 */
Routermonitor.post("/session/config",  monitorController.configSession);

/**
 * @swagger
 * /api/monitor/operator:
 *   get:
 *     summary: Operator filter
 *     tags: [monitor]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                type: array
 */
Routermonitor.get("/operator",  monitorController.getOperator);
/**
 * @swagger
 * /api/monitor/logs:
 *   get:
 *     summary: List Logs monitor
 *     tags: [monitor-logs]
 *     parameters:
 *      - in: query
 *        name: token
 *        schema:
 *           type: string
 *        description: The token.
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
Routermonitor.get("/logs", monitorController.getLogs);
/**
 * @swagger
 * /api/monitor/logs/search:
 *   post:
 *     summary: Search Logs monitor
 *     tags: [monitor-logs]
 *     consumes:
 *      - application/json
 *     parameters:
 *      - in: body
 *        name: filter
 *        schema:
 *           type: object
 *           properties:
 *              token:
 *                  type: string
 *              search:
 *                  type: object
 *                  properties:
 *                      quick_filter:
 *                          type: string
 *                      filters:
 *                          type: object
 *                          default: [{field:,operator:,value:}]
 *        
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
Routermonitor.post("/logs/search",  monitorController.getFilterLogs);

/**
 * @swagger
 * /api/monitor/events:
 *   get:
 *     summary: List parsing monitor
 *     tags: [monitor-events]
 *     parameters:
 *      - in: query
 *        name: token
 *        schema:
 *           type: string
 *        description: The token.
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
Routermonitor.get("/events", monitorController.getEvents);
/**
 * @swagger
 * /api/monitor/events/search:
 *   post:
 *     summary: Search Events monitor
 *     tags: [monitor-events]
 *     parameters:
 *      - in: body
 *        name: filter
 *        schema:
 *           type: object
 *           properties:
 *              token:
 *                  type: string
 *              search:
 *                  type: object
 *                  properties:
 *                      quick_filter:
 *                          type: string
 *                      filters:
 *                          type: object
 *                          default: [{field:,operator:,value:}]
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
Routermonitor.post("/events/search",  monitorController.getFilterEvents);



module.exports = Routermonitor;