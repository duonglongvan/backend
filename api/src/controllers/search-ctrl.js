const SearchService = require("../services/search-service");
class JSearchController{
    /**
     * @getConfig
     * @param {*} req 
     * @param {*} res 
     */
    async getConfig(req,res){
        try{
            const data = await SearchService.get();
             response.success(data,res);
        }catch(err){
             response.error(err,res);
        }
    }
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
   async search(req,res){
        try{
            const data = await SearchService.search(req);
            response.success(data,res);
        }catch(err){
             response.error(err,res);
        }
       
    }
    
}
module.exports = new JSearchController();