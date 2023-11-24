const CONSTANTS = require("../utils/constant");

class JAuthController {
    /**
     * @getCode
     * @param {*} req 
     * @param {*} res 
     */
    getCode(req, res) {
        try {
            response.setPagination(10, 0, 50);
            response.success(CONSTANTS.CODE, res);
        } catch (err) {
            response.error(err, res);
        }
    }
    /**
     * @get
     * @param {*} req 
     * @param {*} res 
     */
    get(req, res) {
        try {
            response.success(null, res);
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
    async login(req, res) {
        try {
            const { loginName, pwd } = req.body;
            //check empty loginName
            if (!loginName) {
                JError.setEmpty("loginName");
            }
            //check empty password
            if (!pwd) {
                JError.setEmpty("password");
            }
            //check login
            const data = await Auth.login(loginName, pwd);
            if (!data) {
                JError.setError({ param1: "login unsuccessful" }, CONSTANTS.CODE.code2009)
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
    async signup(req, res) {
        try {
            const { loginName, pwd, repwd, email } = req.body;
            //check empty loginName
            if (!loginName) {
                JError.setEmpty("loginName");
            }
            //check empty password
            if (!pwd) {
                JError.setEmpty("password");
            }
            if (!repwd) {
                JError.setEmpty("re-password");
            }
            if (!email) {
                JError.setEmpty("email");
            }
            //check login
            const data = await Auth.create(req.body);
            if (!data) {
                JError.setError({ param1: "login unsuccessful" }, CONSTANTS.CODE.code2009)
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
    async signin(req, res) {
        try {
            const { loginName, pwd } = req.body;
            //check empty loginName
            if (!loginName) {
                JError.setEmpty("loginName");
            }
            //check empty password
            if (!pwd) {
                JError.setEmpty("password");
            }
            //check login
            const data = await Auth.signIn(loginName, pwd);
            if (!data) {
                JError.setError({ param1: "login unsuccessful" }, CONSTANTS.CODE.code2009)
            }
            response.success(data, res);
        } catch (err) {
            response.error(err, res);
        }
    }

}
module.exports = new JAuthController();