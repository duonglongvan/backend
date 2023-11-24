const dotenv = require('dotenv');
dotenv.config({
  path: `./.env`
});
class JMongodb {
  /**
   * 
   * @returns 
   */
  getMongodbUri() {
    let uri = ""; //imip%401234
    if (process.env.DB_MONGO_PASSWORD && process.env.DB_MONGO_USER) {
      uri = process.env.DB_MONGO_USER + ":" + process.env.DB_MONGO_PASSWORD.replace("@", "%40");
    }
    if (uri) {
      uri += "@";
    }
    uri = uri + process.env.DB_MONGO_HOST + ":" + process.env.DB_MONGO_PORT + "/?authMechanism=DEFAULT";
    //  logger.info("uri is",uri);
    return "mongodb://" + uri;
  }
  /**
   * connection
   */
  async connection() {
    let options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // keepAlive: true,
      // keepAliveInitialDelay: 300000,
      // useFindAndModify: false,
      // useCreateIndex: true,
      autoIndex: true,
      dbName: process.env.DB_MONGO_NAME
    };
    let uri = this.getMongodbUri();
    // logger.info("uri is",uri);
    //uri='mongodb://raw:trp%40imip@1234@192.168.3.6:27017/?authMechanism=DEFAULT'
    mongoose.set("strictQuery", false);
    await mongoose
      .connect(uri, options)
      .then(() => {
        logger.trace("Connected to mongodb successful!.");
      })
      .catch((err) => {
        logger.error("Not connect mongodb.");
        logger.trace(err);
      });
  }
  /**
   * 
   * @returns 
   */
  setMongodbUriLocal() {
    let uri = ""; //imip%401234
    if (process.env.LOCAL_DB_MONGO_PASSWORD && process.env.LOCAL_DB_MONGO_USER) {
      uri = process.env.LOCAL_DB_MONGO_USER + ":" + process.env.LOCAL_DB_MONGO_PASSWORD.replace("@", "%40");
    }
    if (uri) {
      uri += "@";
    }
    uri = uri + process.env.LOCAL_DB_MONGO_HOST + ":" + process.env.LOCAL_DB_MONGO_PORT + "/?authMechanism=DEFAULT";
    //  logger.info("uri is",uri);
    return "mongodb://" + uri;
  }
  /**
   * 
   */
  async connectLocal() {
    let options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // keepAlive: true,
      // keepAliveInitialDelay: 300000,
      // useFindAndModify: false,
      // useCreateIndex: true,
      autoIndex: true,
      dbName: process.env.LOCAL_DB_MONGO_NAME
    };
    let uri = this.setMongodbUriLocal();
    // logger.info("uri is",uri);
    mongoose.set("strictQuery", false);
    await mongoose
      .connect(uri, options)
      .then(() => {
        logger.trace("Connected to mongodb local successful!.");
      })
      .catch((err) => {
        logger.error("Not connect mongodb local.");
        logger.trace(err);
      });
  }
}
module.exports = new JMongodb();
