const redis = require("redis");
//const redisScan = require('node-redis-scan');
//let scanner;
const CONSTANTS = require("./constant");
let clientRedis;
let cursor = '0';
class JRedis {
    /**
     * @initIalize
     **/
    async initIalize() {
        let redisConfig = {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            db:process.env.REDIS_DBNAME
        };
        if (process.env.REDIS_PASSWORD) redisConfig.password = process.env.REDIS_PASSWORD;
        if (process.env.REDIS_USERNAME) redisConfig.username = process.env.REDIS_USERNAME;
        
        if (!clientRedis) clientRedis = redis.createClient(redisConfig);
        this.clientRedis = clientRedis;
        const connRedis = await clientRedis.connect();
        if (connRedis) {
            logger.trace(`Redis is ready on port ${CONSTANTS.REDIS.port}`);
        }
       //scanner = new redisScan(clientRedis);
        // clientRedis.on("connect", () => {
        //   logger.trace(`Redis is ready on port ${CONSTANTS.REDIS.port}`);
        // });
        clientRedis.on("error", (err) => {
            logger.error(err);
        });
    }
    /**
   *   @setKeyCache
   * @param key
   */
    createKey(key) {
        return CONSTANTS.REDIS.prefix + "." + key;
    }
    /**
     *   @setKeyCache
     * @param key
     */
    setKeyCache(key) {
        return CONSTANTS.REDIS.prefix + "." + key;
    }
    /**
     *
     *  get
     * @param key
     */
  async get(key) {
        const res = await  clientRedis.get(key);
        if(res && typeof res=='string'){
          return JSON.parse(res);
        }
        return res;
    }
    /**
     * 
     * @param userId 
     */
    async getUserInfo(userId) {
        const keycache = CacheService.setKeyCache(userId);
        let cacheToken = await CacheService.get(keycache);
        if (cacheToken) {
            const user = await jwtAuth.verifyAccessToken(cacheToken);

            return user;
        }
        return null;
    }
    /**
     * 
     * @param key 
     * @param hash 
     * @returns 
     */
    hget(key, hash) {
        return new Promise((resolve, reject) => {
            clientRedis.hget(key, hash, (err, value) => {
                if (err) resolve(null);
                else {
                    resolve(util.isJson(value));
                }
            });
        });
    }
    /**
     * 
     * @param {*} q 
     * @returns 
     */
    keys(q = "*") {
        logger.trace("[start] get keys ", q);
        return new Promise((resolve, reject) => {
            clientRedis.keys(q, (err, keys) => {
                logger.trace("get keys ", keys);
                if (err) resolve(err.message);
                else resolve(keys);
            });
        });
    }
    /**
     * 
     * @param {*} pattern 
     * @returns 
     */
   async scan(pattern, limit) {
        logger.trace("[Scan] get keys ", pattern,limit);
        let items=[];
        for await (const key of clientRedis.scanIterator({MATCH: pattern,COUNT: limit})) {
            // use the key!
            const item= await clientRedis.get(key);
            if(item) items.push(JSON.parse(item));
          }
          return items;
    }
    /**
     * 
     * @param {*} pattern 
     * @param {*} limit 
     */
   async setLpush(key,arr=[]){
        const res = await clientRedis.lPush(key, arr);    
        return res;  
    }
    async setRpush(key,arr=[]){
        const res = await clientRedis.rPush(key, arr);    
        return res;  
    }
    async setList(key,arr=[],orderBy='DESC'){
        let res;
       // logger.info("arr 1",arr);
        if(orderBy.toLocaleLowerCase()=='asc'){
           res = await clientRedis.lPush(key, arr);  
        }else{
           res = await clientRedis.rPush(key, arr);  
        }
           
        return res;  
    }
    async removeList(key){
        const res9 = await clientRedis.del(key);
        console.log(res9);
    }
    async setItem(key,val){
        const res = await clientRedis.lPush(key, val);    
        return res;  
    }
    async gets(key,skip,limit){
        if(!skip) skip=0;
        if(!limit) limit=-1;
        let res = await clientRedis.lRange(key, skip, limit);    
        res= res.map(e=>{
            if(typeof e=='string') e = JSON.parse(e);
            return e;
        })
        return res;  
    }
    async getTatalList(key){
        return await clientRedis.lLen(key);
    }
    /**
     * 
     * @param {*} key 
     * @returns 
     */
    hkeys(key) {
        return new Promise((resolve, reject) => {
            clientRedis.hkeys(key, (err, keys) => {
                if (err) resolve(null);
                else resolve(keys);
            });
        });
    }
    /**
     * @set
     * @param key
     * @param value
     * @param expire_time
     */
  async  set(key, value, expire_time = -1) {
        logger.info("key ",key,value,expire_time);
        if (typeof value == "object") value = JSON.stringify(value);
        if (clientRedis) {
            if (parseInt(expire_time) == -1) {
                logger.info("key -1",parseInt(expire_time));
              const rec=  await clientRedis.set(key, value);
              return rec;
            } else {
              return await  clientRedis.set(key, value, {
                    EX: expire_time,
                    NX: true
                });
            }
        }
    }
    /**
     *
     * @param key
     * @param hash
     * @param value
     */
    hset(key, hash, value) {
        if (typeof value == "object") value = JSON.stringify(value);
        return new Promise((resolve, reject) => {
            if (!clientRedis.connected) return resolve(false);
            clientRedis.hset(key, hash, value, (err) => {
                resolve(err ? false : true);
            });
        });
    }
    /**
     * 
     * @param key 
     */
    del(key) {
        return new Promise((resolve, reject) => {
            clientRedis.del(key, (err) => {
                resolve(err ? false : true);
            });
        });
    }
    /**
     * 
     * @param key 
     * @returns 
     */
    async incr(key) {
        try {
            const points = await clientRedis.incr(key);
            if (points) return true;
        } catch (error) {
            return false;
        }
    }
    async decr(key) {
        try {
            const points = await clientRedis.decr(key);
            if (points) return true;
        } catch (error) {
            return false;
        }
    }
    /**
     * 
     * @param {*} key 
     * @param {*} obj 
     * @returns 
     */
    async addItemArray(key, obj) {
        return new Promise((resolve, reject) => {
            clientRedis.rPush(
                key,
                JSON.stringify(obj),
                function (err, data) {
                    if (err) {
                        resolve(null);
                    } else resolve(data);
                },
            );
        });
    }
    /**
     * 
     * @param {*} key 
     * @param {*} obj 
     * @returns 
     */
    async addArray(key, obj) {
        return new Promise((resolve, reject) => {
            clientRedis.lPush(
                key,
                JSON.stringify(obj),
                function (err, data) {
                    if (err) {
                        resolve(null);
                    } else resolve(data);
                },
            );
        });
    }
    async getArray(key, start, limit) {
        return new Promise((resolve, reject) => {
            start = start ? start : 0;
            limit = limit ? limit : -1;
            clientRedis.lRange(key, start, limit, function (err, reply) {
                if (err) resolve(null);
                else resolve(reply);
            });
        });
    }
    async removeItemArray(key, obj) {
        return new Promise((resolve, reject) => {
            if (obj) {
                clientRedis.lRem(key, 0, obj, function (err) {
                    if (err) resolve(false);
                    else resolve(true);
                });
            } else {
                resolve(false);
            }
        });
    }

    async getSizeArray(key) {
        return new Promise((resolve, reject) => {
            clientRedis.llen(key, function (err, reply) {
                if (err) resolve(null);
                else resolve(reply);
            });
        });
    }
    async hmset(key, obj) {
        return new Promise((resolve, reject) => {
            if (!clientRedis.connected || !obj || !key) return resolve(false);
            const data = Object.entries(obj).join(",");
            clientRedis.hmset(key, data, (err) => {
                resolve(err ? false : true);
            });
        });
    }
    async hgetall(key) {
        return new Promise((resolve, reject) => {
            if (!clientRedis.connected) return resolve(false);
            clientRedis.hgetall(key, (err, reply) => {
                if (err) resolve(null);
                else resolve(reply);
            });
        });
    }
    async hincr(key, field, value = 1) {
        return new Promise((resolve, reject) => {
            clientRedis.hincrby(key, field, value, function (err, reply) {
                if (err) resolve(null);
                else resolve(reply);
            });
        });
    }
    async hdecr(key, field, value = -1) {
        return new Promise((resolve, reject) => {
            clientRedis.hincrby(key, field, value, function (err, reply) {
                if (err) resolve(null);
                else resolve(reply);
            });
        });
    }
    /**
     * 
     * @param {*} obj 
     */
    async createIndex(keyCache, obj) {
        try {
            let objIndex = {};
            if (obj) {
                for (const [key, value] of Object.entries(obj)) {
                    objIndex['$.' + key] = {
                        type: redis.SchemaFieldTypes.TEXT,
                        SORTABLE: true
                    }
                }
            }
            await clientRedis.ft.create(keyCache, objIndex, {
                ON: 'JSON',
                PREFIX: 'user:'
            });
        } catch (e) {
            if (e.message === 'Index already exists') {
                console.log('Index exists already, skipped creation.');
            } else {
                // Something went wrong, perhaps RediSearch isn't installed...
                console.error(e);
            }
        }
    }
    /**
     * 
     * @param {*} key 
     * @param {*} data 
     * @returns 
     */
    setData(key, data) {
        return clientRedis.json.set(key, '$', data);
    }
}
module.exports = new JRedis();
