const express = require('express');
const http = require("http");
const helmet = require('helmet');
const xss = require('xss-clean');
const path = require("path");
const compression = require('compression');
const cors = require('cors');
const log4js = require("log4js");
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const httpStatus = require('http-status');
const morgan = require('./config/morgan');
const CONSTANTS = require("./utils/constant");
global.CONSTANTS = CONSTANTS;
const JError = require("./utils/error");
global.JError = JError;
const mongoose = require("mongoose");
global.mongoose = mongoose;
const Schema = mongoose.Schema;
global.Schema = Schema;
const ImipMiddle= require("./utils/ImipMiddle.js");
global.ImipMiddle=ImipMiddle;
const imip= require("./utils/imip.js");
global.imip=imip;
const response = require("./utils/response");
global.response = response;
const route = require('./route');
const pathSocket= path.join(__dirname, "sockets");
global.pathSocket=pathSocket;
const Socket = require("./utils/socket");
global.Socket=Socket;
const keySession="session";
const Auth = require("./utils/authorization");
global.Auth = Auth;
global.keySession = keySession;
const Cache = require("./utils/redis");
global.Cache = Cache;
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const kafka = require("./utils/kafka");
const monodb = require('./utils/monodb');
const clickhouse = require('./utils/clickhouse');
global.clickhouse=clickhouse;
log4js.configure({
  appenders: { cheese: { type: "console", filename: "logs/log4js.log" } },
  categories: { default: { appenders: ["cheese"], level: "error" } },
});
const logger = log4js.getLogger();
logger.level = "trace";
global.logger = logger;
global.express = express;
global.kafka=kafka;
const app = express();

app.use(morgan.successHandler);
app.use(morgan.errorHandler);

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());
// Define the swagger options
const urlRoot ='http://'+process.env.HOST+":"+process.env.PORT+"/";
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Rule Management Server API documentation',
      version: '1.0.0',
    },
  },
  swaggerOptions:{
    urls: [
      {
        url: urlRoot+'v1/',
        name: 'v1'
      },
      {
        url: urlRoot+'v2/',
        name: 'v2'
      }
    ]
  },
  "securityDefinitions": {
    "Authorization": {
    "type": "apiKey",
    "name": "authorization",
    "in": "header",
    "description": "Authentication token"
  }
},
  apis: [`${__dirname}/docs/*.yml`, `${__dirname}/routes/*.js`], // Path to the API docs
};

const options = {
  explorer: true,
};
// Initialize swagger-jsdoc
const swaggerSpecs = swaggerJsdoc(swaggerOptions);

// Serve swagger-ui at /api-docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, options));

// set security HTTP headers
app.use(helmet());
//
if(process.env.KAFKA_ENBALE=='true'){
   global.kafka.connection();
}
if (process.env.LOCAL_MONGODB_ENABLE=='true') {
  monodb.connectLocal();
}
//
if (process.env.MONGODB_ENABLE=='true') {
  monodb.connection();
}
if(process.env.REDIS_ENABLE=="true"){
  Cache.initIalize();
}
if(process.env.CLICKHOUSE_ENABLE=="true"){
  clickhouse.initIalize();
}
// v1 api routes
route.initIalize(app);
//app.use('/api', route.initIalize(app));

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

const server = http.createServer(app);
Socket.initIalize(server);
module.exports = server;
