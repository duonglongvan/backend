const bcrypt = require("bcrypt");
const md5 = require("MD5");
const jwt = require("jsonwebtoken");
const CONSTANTS = require("./constant");
const AuthModel = require("../models/Auth");
class JAuthorization{
    /**
     * login
     * @param {*} loginName 
     * @param {*} pwd 
     * @returns 
     */
    login(loginName,pwd){
        logger.info("user",loginName,md5(loginName)," pwd:",pwd);
        const mdl=CONSTANTS.USER.loginName;
        const mdp=CONSTANTS.USER.pwd;
        logger.info("user",mdl,md5(loginName)," pwd:",mdp);
        if(md5(loginName)==mdl && md5(pwd)==mdp){
            const cript1 = this.getEncrypt(mdl,mdp);
            const secret=md5(pwd)+md5(loginName);
            const bool = this.checkPwdAuth(secret,cript1.encrypted);
            if(bool){
              // const auth = new AuthModel();
               const user= {id:31,name:"Admin"};
               const access_token= this.createToken(user);
               return {user:user,access_token};
            }
        }
        return null;
    }
/**
 * signIn
 * @param {*} loginName 
 * @param {*} pwd 
 */
  async signIn(loginName,pwd){    
    const secretKey = this.createSecretKey(pwd,loginName);
    const AuthModelExits =await AuthModel.findOne({secretKey:secretKey});
    //logger.info("AuthModelExits ",AuthModelExits);
    if(AuthModelExits){
        const secret = this.createSecret(pwd,loginName);
        const bool = this.checkPwdAuth(secret,AuthModelExits.encrypted);
        if(bool){
          // const auth = new AuthModel();
           const user= {id:AuthModelExits.id,name:AuthModelExits.name,_id:AuthModelExits._id,role:AuthModelExits.role};
           const access_token= this.createToken(user);
           return {user:user,access_token};
        }
    }
    return false;
  }
    /**
     * @account
     * @param {*} account 
     */
  async create(account){
        const AuthModelExits = await AuthModel.findOne({loginName:account.loginName});
        if(AuthModelExits){
            JError.duplicate("loginName",{param1:"Username has been used before"});
        }
        const auth = new AuthModel();
        const crpty = this.getEncrypt(account.loginName,account.repwd);
        auth.encrypted = crpty.encrypted;
        auth.secretKey=crpty.secretKey;
        auth.loginName= account.loginName;
        auth.email = account.email;
        auth.name = account.loginName;
        auth.status=1;
        auth.id=await this.getId();
        auth.role=account.role?account.role:CONSTANTS.USER.role;
        //logger.info("auth is",auth);
        const res = await auth.save();
        if(res){
            return true;
        }
        return false;
    }
    /**
     * 
     * @returns 
     */
  async  getId(){
      const res = await  AuthModel.find({}).sort({id : -1}).limit(1);
      logger.info("res is",res);
      return res && res[0] && res[0].id?(res[0].id+1):1;
    }
    /**
     * 
     * @param {*} data 
     * @param {*} expired 
     * @returns 
     */
    sign (data, expired = 864000) {
        return jwt.sign(data,  CONSTANTS.APP.KEY, { expiresIn: expired });
    }
    /**
     * verify
     * @param {*} token 
     * @returns 
     */
   async verifyAccessToken  (token)  {
        return new Promise((resolve, reject) => {
            jwt.verify(token, CONSTANTS.APP.KEY, (err, decoded) => {
                if (err || !decoded) {
                    resolve(null);
                } else {
                    resolve(decoded);
                }
            });
        });
    }
      /**
     * 
     * @param {*} data 
     * @param {*} expired 
     * @returns 
     */
     signToken (data,key, expired = 864000) {
        if(!key) key=CONSTANTS.APP.KEY;
        return jwt.sign(data,  key, { expiresIn: expired });
    }
    /**
     * verify
     * @param {*} token 
     * @returns 
     */
   async verifyToken  (token,key)  {
    if(!key) key=CONSTANTS.APP.KEY;
        return new Promise((resolve, reject) => {
            jwt.verify(token,key, (err, decoded) => {
                if (err || !decoded) {
                    resolve(null);
                } else {
                    resolve(decoded);
                }
            });
        });
    }
    /**
     * 
     * @param {*} user 
     * @returns 
     */
    createToken(user){
        const dataToken = {
            key:CONSTANTS.APP.KEY,
            user: user
        };
       return this.sign(dataToken,CONSTANTS.EXPIRE_ACCESS_TOKEN);
    }
    /**
     * 
     * @param {*} strPwd 
     * @param {*} encrypted 
     * @returns 
     */
    checkPwdAuth(strPwd,encrypted){
        return bcrypt.compareSync(strPwd, encrypted);
    }
    /**
     * 
     * @param {*} loginName 
     * @param {*} pwd 
     * @returns 
     */
    getEncrypt(loginName, pwd) {
        const salt = bcrypt.genSaltSync(8);
        const encConfirm = md5(CONSTANTS.USER.secret + loginName + salt);
        const secretKey=this.createSecretKey(pwd,loginName);
        const secret = this.createSecret(pwd,loginName);
        const encrypted = bcrypt.hashSync(secret, salt, null);
        return { secret: salt,secretKey:secretKey, encrypted: encrypted, encConfirm: encConfirm };
    }
    /**
     * 
     * @param {*} pwd 
     * @param {*} loginName 
     */
    createSecretKey(pwd,loginName){
        return md5(pwd+CONSTANTS.USER.secret + loginName );
    }
    /**
     * 
     * @param {*} pwd 
     * @param {*} loginName 
     * @returns 
     */
    createSecret(pwd,loginName){
        return md5(pwd)+md5(loginName)+CONSTANTS.USER.secret;
    }
}
module.exports= new JAuthorization()