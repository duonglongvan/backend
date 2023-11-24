class ImipMiddle {
  async isAuth(req, res, next) {
    try {
      logger.debug("Check access authen");
      let token = req.headers.authorization || req.headers.Authorization;
      if (!token) {
        JError.setUnauthorized();
      }
      let data = token ? await Auth.verifyAccessToken(token) : null;
      if (!data) {
        JError.setUnauthorized();
      }
      if (data.key != CONSTANTS.APP.KEY) {
        JError.setUnauthorized();
      }
      req.user = data.user;
      return next();
    } catch (err) {
      response.error(err, res);
      return false;
    }
  }
  async isToken(req, res, next) {
    try {
      let token = req.headers.authorization || req.headers.Authorization;
      if (!token) {
        token = req.body ? req.body.token : null;
      }
      if (!token) {
        token = req.query ? req.query.token : null;
      }
      if (!token) {
        JError.setUnauthorized();
      }
      let data = token ? await Auth.verifyToken(token, global.keySession) : null;
      if (!data) {
        JError.setUnauthorized();
      }
      req.user = data;
      req.customer = data;
      req.token=token;
      return next();
    } catch (err) {
      response.error(err, res);
      return false;
    }
  }
}
module.exports = new ImipMiddle();
