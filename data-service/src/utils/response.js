const CONSTANTS = require("./constant");
const util = require("./util");
class JResponse{
    /**
     * @setPagination
     * @param {*} total 
     * @param {*} offset 
     * @param {*} limit 
     * set pagination data
     */
    setPagination(total=0,offset=0,limit=50){
        this.pagination = {total:total,limit:limit,offset:offset}
    }
    /**
     * 
     * @param {*} total 
     * @param {*} offset 
     * @param {*} limit 
     */
    pagination(total=0,offset=0,limit=50){
        this.pagination = {total:total,limit:limit,offset:offset}
    }
     /**
     * 
     * @param {*} total 
     * @param {*} offset 
     * @param {*} limit 
     */
     page(total=0,offset=0,limit=50){
        this.pagination = {total:total,limit:limit,offset:offset}
    }
    /**
     * @success
     * @param {*} data 
     * @param {*} res 
     * @param {*} code 
     * response data to client
     */
    success(data,res,param=[]){
        const dataMessage={
            ...param,
            data:data&&data.data?data.data:data
        };
        if(!dataMessage.code){
            dataMessage.code=CONSTANTS.CODE.cod2000.key;
        }
         if(!dataMessage.param1){
            dataMessage.param1=CONSTANTS.CODE.cod2000.name;
        }
        if(this.pagination){
            dataMessage['pagination']=this.pagination;
        }else if(data&&data.page){
            dataMessage['pagination']=data.page;
        }
        this.pagination=null;
        res.status(CONSTANTS.CODE200).send(dataMessage);
    }
    /**
     * 
     * @param {*} err 
     * response data alert to client
     */
    error(err,res){
        let message=err?err.message:{};
        if(util.isJsonString(message)){
            message = JSON.parse(message);
        }
        const dataMessage={
            code:message.code?message.code:CONSTANTS.CODE.code5000.key,
            param1:message.param1?message.param1:message,
            param2:message?.param2,
            param3:message?.param3,
            field:message?.field
        };
       res.status(CONSTANTS.CODE200).send(dataMessage);
    };
}
module.exports = new JResponse();