const Router = express.Router();
const AuthController = require("../controllers/auth-ctrl");
logger.trace("Auth route start....");
/**
 * @swagger
 * /api/auth/code:
 *   get:
 *     summary: Get the code for client
 *     tags: [Auth]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                type: string
 */
Router.get("/code",  AuthController.getCode);

/**
 * @swagger
 * /api/auth:
 *   get:
 *     summary: Get the auth
 *     tags: [Auth]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                type: string
 */
Router.get("/",  AuthController.get);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                type: string
 */
Router.post("/login",  AuthController.login);
/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Create Account
 *     tags: [Auth]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                type: string
 */
Router.post("/signup",  AuthController.signup);
/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Create Account
 *     tags: [Auth]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                type: string
 */
Router.post("/signin",  AuthController.signin);
module.exports = Router;