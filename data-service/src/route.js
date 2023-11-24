
const path = require("path");
const fs = require("fs");
class JRoute{
    
    initIalize(app){
      try{
        this.app=app;
        const httpRouteDir = path.join(__dirname, "routes");
        this.setRoute(httpRouteDir, "/api");
       // app.get("/", this.index);  
      }catch(error){
         logger.error(error);
      }
    }
    /**
   *@setRoute
   * @param httpRir
   * @param pathUrl
   */
   setRoute(httpRir, pathUrl) {
    //console.log("httpRir==>", httpRir);
    const files = fs.readdirSync(httpRir);
  //  logger.info("files is ",files);

    for (let file of files) {
      const ischeck = file.includes(".");
      if (!ischeck) {
        this.setRoute(path.join(httpRir, file), pathUrl + "/" + file);
      } else {
        if (
          !file.includes("..") &&
          //!file.includes(".ts") &&
          !file.includes(".map")
        ) {
          this.includeFile(file, httpRir, pathUrl);
        }
      }
    }
  }
  /**
   * @includeFile
   * @param file
   * @param httpRir
   * @param pathUrl
   */
   includeFile(file, httpRir, pathUrl) {
    const filename = file.replace(".js", "").replace(".ts", "");
    const pathfile=path.join(httpRir, file); 
    //logger.info("pathUrl==>", pathUrl + "/" + filename,filename,pathfile);
    // if(filename!='auth')
    // this.app.use(pathUrl + "/" + filename,ImipMiddle.isAuth, require(pathfile));
    // else
    this.app.use(pathUrl + "/" + filename, require(pathfile));
    
  }
}
module.exports= new JRoute();