const CONSTANTS = require("./constant");
const util = require("./util");

class JError{
    /**
     * @setError
     * @param {@} err 
     * @param {*} code 
     */
    setError(err,code=null){
        if(typeof err=='string'){
            if(util.isJsonString(err))
            {
                err = JSON.parse(err);
            }else{
                err={param1:err};
            }
        }
        var objError={
            code:err.code?err.code:(code?code:CONSTANTS.CODE.code5000),
            param1:err.param1
        }
        if(err.param2){
            objError['param2']=err.param2;
        }
        if(err.param3){
            objError['param3']=err.param3;
        }
        if(err.field){
            objError['field']=err.field;
        }
        throw new Error(JSON.stringify(objError));
    }
      /**
     * @setEmpty
     * @param {*} field 
     * throw error field empty
     */
      set(params=[]){
        this.setError({...params});
    }
      /**
     * @setEmpty
     * @param {*} field 
     * throw error field empty
     */
      notExitsData(field){
        this.setError({param1:CONSTANTS.CODE.code2009.description,field:field,code:CONSTANTS.CODE.code2009.key});
    }
    /**
     * @setEmpty
     * @param {*} field 
     * throw error field empty
     */
    setEmpty(field){
        this.setError({param1:CONSTANTS.CODE.code2001.description,field:field,code:CONSTANTS.CODE.code2001.key});
    }
    /**
     * @setEmpty
     * @param {*} field 
     * throw error field empty
     */
    empty(field){
        this.setEmpty(field);
    }
     /**
     * @setEmpty
     * @param {*} field 
     * throw error field empty
     */
     setFormat(field){
        this.setError({param1:CONSTANTS.CODE.code2002.description,field:field,code:CONSTANTS.CODE.code2002.key});
    }
    /**
     * @setEmpty
     * @param {*} field 
     * throw error field empty
     */
    format(field){
        this.setFormat(field);
    }
     /**
     * @setEmpty
     * @param {*} field 
     * throw error field empty
     */
    setLength(field,param={}){
        this.setError({...param,param1:CONSTANTS.CODE.code2003.description,field:field,code:CONSTANTS.CODE.code2003.key});
    }
    /**
     * @setEmpty
     * @param {*} field 
     * throw error field empty
     */
    format(field,param={}){
        this.setLength(field,param);
    }
     /**
     * @setEmpty
     * @param {*} field 
     * throw error field empty
     */
     setDuplicate(field,param={}){
        this.duplicate(field,param);
    }
     /**
     * @setEmpty
     * @param {*} field 
     * throw error field empty
     */
     duplicate(field,param={}){
        const err={...param,field:field,code:CONSTANTS.CODE.code2008.key};
        if(!err.param1) err.param1=CONSTANTS.CODE.code2008.description;
        this.setError(err);
    }
     /**
     * @setEmpty
     * @param {*} field 
     * throw error field empty
     */
     setBadRequest(param={}){
        this.setError({...param,param1:CONSTANTS.CODE.code4000.description,code:CONSTANTS.CODE.code4000.key});
    }
     /**
     * @setEmpty
     * @param {*} field 
     * throw error field empty
     */
     setUnauthorized(param={}){
        this.setError({...param,param1:CONSTANTS.CODE.code4001.description,code:CONSTANTS.CODE.code4001.key});
    }
       /**
     * @setEmpty
     * @param {*} field 
     * throw error field empty
     */
       setForbidden(param={}){
        this.setError({...param,param1:CONSTANTS.CODE.code4003.description,code:CONSTANTS.CODE.code4003.key});
    }
       /**
     * @setEmpty
     * @param {*} field 
     * throw error field empty
     */
    setNotFound(param={}){
        this.setError({...param,param1:CONSTANTS.CODE.code4004.description,code:CONSTANTS.CODE.code4004.key});
    }
}
module.exports= new JError();