const SearchModel = require("../models/Search");
class JSearchService{
    get(){
        return new SearchModel();
    }
    
    search(req){
        return true;
    }
}
module.exports= new JSearchService();