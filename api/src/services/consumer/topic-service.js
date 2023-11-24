const CONSTANTS = require("../../utils/constant");
// const modelMonitoring = require("../../models/Monitoring");
const util = require("../../utils/util");
const moment =  require("moment");
let msgCount = {};
let timerIdentifier, timerCacheExpire;
let ms = 180;
let in_time_start=0;
const cacheData = { data: [] };
class JTopicService {
    async initIalize(msg) {
        let { topic, data, partition, key, timestamp, offset } = msg;
        const topicCheck = CONSTANTS.TOPICS.find(e => e.name == topic);
        if (topicCheck && data) {
           
            //create obj
            // const modelMonitor = new modelMonitoring();
            // modelMonitor.data = this.convertStringToObject(data, timestamp, offset);
            // modelMonitor.id = moment(modelMonitor.data.time_create).format("x");
            // modelMonitor.topic = topic;
            // modelMonitor.partition = partition;
            // if (!msgCount.total) msgCount.total = 0;
            // if (!msgCount.data) msgCount.data = [];
            // if(msgCount.total==1) in_time_start = Date.now();
            // const check = msgCount.data.find(e=>e.id==modelMonitor.id);
            // if(!check){ 
            //     // msgCount.data.push(modelMonitor);
            //      msgCount.total = msgCount.total + 1; 
            //     // logger.trace("Id is ", modelMonitor.id," item ", msgCount.total);       
            // }
            // process insert/update
            //this.setDb(msgCount,ms,in_time_start);
            //
            
            // const keyConfig = Cache.createKey("config");
           // let timer = 5;// await Cache.get(keyConfig);
            // if(timer) timer=parseInt(timer);
            //  else timer=5;
            //const keycache = Cache.createKey(topic);
            //Cache.addArray(keycache,modelMonitor.data);
           // const idkey = Date.now();// util.get(data,'<','>'); "." + partition +  
            //Cache.set(keycache +  "." +idkey, modelMonitor.data, timer* 60);
            //this.set(keycache,modelMonitor.data);
           // await this.setCache(keycache,msgCount,in_time_start);
            //            
        }
    }
    /**
     * 
     * @param {*} key 
     * @param {*} data 
     * @param {*} timer 
     * 1-1
     */
    async setCache(key,msgCount,in_time_start) {
         if (msgCount.data.length == 10000) {
            await Cache.removeList(key);
            const data = msgCount.data.map(e=>{
                return JSON.stringify(e);
            });
            await Cache.setList(key,data);
            msgCount = {};
        }else{
            const timec= Math.floor( (Date.now()-in_time_start)/1000);
            if(timec>CONSTANTS.REDIS.max_insert){
                const dataArr = msgCount.data.map(e=>{
                    return JSON.stringify(e);
                });
                //logger.info("dataArr is",dataArr);
                await Cache.removeList(key);
                await Cache.setList(key,dataArr);
                msgCount = {};
            }
        }
        in_time_start = 0;
        return msgCount;
    }
    /**
     * 
     * @param {*} key 
     * @param {*} timer 
     * @returns 
     */
    async filterCache(key, timer) {
        let lst = await Cache.gets(key, 0, -1);
        if (lst && lst.length > 0) {
            lst = lst.filter(e => {
                if (e) {
                    const item = JSON.parse(e);
                    const t = Date.now() - timer * 60 * 1000;
                    if (item.created > t) {
                        return e;
                    }
                }
            });
        }else lst=[];
        return lst;
    }
    /**
     * 
     */
    async setDb(msgCount,ms,in_time_start){
        if (msgCount.data.length == 100000) {
            logger.trace("Start update 100.000 rows data for monitoring times ",Date.now()-in_time_start);
            this.updateData(msgCount);
            msgCount = {};
            in_time_start = 0;
        } else {
            const timec= Math.floor( (Date.now()-in_time_start)/1000);
            if(timec>CONSTANTS.MAX_TIME_REQUEST_STORAGE){
                logger.trace("Start update ", msgCount.data.length, " rows data for monitoring");
                this.updateData(msgCount, ms);
                msgCount = {};
            }              
        }
        return msgCount;
    }
    /**
     * 
     * @param {*} msgCount 
     */
    async updateData(msgCount, ms = 300) {
        if(!ms || ms<0) ms=300;
        const time_start = Date.now();
        // await modelMonitoring.insertMany(msgCount.data);
        // const time_end = Date.now() - time_start;
        // logger.info("Update success data monitoring ", msgCount.data.length, " rows is time ", time_end, 'ms');
        // let time = Date.now() - ms * 1000;
        // const total = await modelMonitoring.countDocuments({ created: { $gte: 0 } });
        // logger.debug("total is", total);
        // if (total > 1000) {
        //     logger.trace("Delete data more than 5 minutes, Starting...");
        //     const resultDel = await modelMonitoring.deleteMany({ created: { $lt: time } })
        //     logger.info("Delete sucess...", resultDel);
        // }
    }
    /**
     * 
     * @param {*} key 
     * @param {*} data 
     */
    async set(key, data) {
        Cache.createIndex(key, data);
        const id = new mongoose.Types.ObjectId();
        const keycache = key + "." + id;
        const res = await Cache.setData(keycache, data);
        logger.info("set cache [", keycache, "] is", res);
    }
    /**
     * 
     * @param {*} str 
     */
    convertStringToObject(str, timestamp, offset) {
        let obj = {};
        try {
            if (str && typeof str == 'string') {
                let strParse = str.split(" ");
                if (strParse && strParse.length > 0) {
                    let k = 0;
                    for (let val of strParse) {
                        if (val) {
                            if (val.includes("=")) {
                                let sparse = val.replace(/"/gi, "").replace(/'/gi, "").split("=");
                                obj[sparse[0]] = sparse[1];
                            } else {
                                if (k == 1) obj.time_create = val;
                                if (k == 3) obj.ip = val.replace(/\[/gi, "").replace(/\]/gi, "");
                            }
                            k++;
                        }
                    }
                }
            }
        } catch (err) {
            logger.error(err);
        }
        return obj;
    }
    /**
     * 
     * @param {*} bytes 
     * @param {*} decimals 
     * @returns 
     */
    formatBytes(bytes, decimals = 2) {
        if (!+bytes) return '0 Bytes'

        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

        const i = Math.floor(Math.log(bytes) / Math.log(k))

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }

}
module.exports = new JTopicService();