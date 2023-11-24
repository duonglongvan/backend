class JUtil {
  /**
   * 
   * @param {*} str 
   * @returns 
   */
  isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
  /**
   * 
   * @param {*} num 
   * @returns 
   */
  isNumeric(value) {
    return /^-?\d+$/.test(value);
  }
  /**
   * 
   * @param {*} strJson 
   * @returns 
   */
  isJson(strJson) {
    if (JUtil.isJsonString(strJson)) {
      return JSON.parse(strJson);
    }
    return strJson;
  }
  /**
   * 
   * @param {*} sub1 
   * @param {*} sub2 
   * @returns 
   */
  getFromBetween(sub1, sub2) {
    if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
    const SP = this.string.indexOf(sub1) + sub1.length;
    const string1 = this.string.substr(0, SP);
    const string2 = this.string.substr(SP);
    const TP = string1.length + string2.indexOf(sub2);
    return this.string.substring(SP, TP);
  }
  /**
   * 
   * @param {*} sub1 
   * @param {*} sub2 
   * @returns 
   */
  removeFromBetween(sub1, sub2) {

    if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
    const removal = sub1 + this.getFromBetween(sub1, sub2) + sub2;
    this.string = this.string.replace(removal, "");
  }
  /**
   * 
   * @param {*} sub1 
   * @param {*} sub2 
   * @returns 
   */
  getAllResults(sub1, sub2) {
    // first check to see if we do have both substrings
    // logger.info("this.string is",this.string);
    if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;

    // find one result
    const result = this.getFromBetween(sub1, sub2);
    // push it to the results array
    this.results.push(result);
    // remove the most recently found one from the string
    this.removeFromBetween(sub1, sub2);

    // if there's more substrings
    if (this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
      this.getAllResults(sub1, sub2);
    } else return;
  }
  /**
   * 
   * @param {*} string 
   * @param {*} sub1 
   * @param {*} sub2 
   * @returns 
   */
  get(string, sub1, sub2) {
    this.results = [];
    this.string = string;
    this.getAllResults(sub1, sub2);
    return this.results;
  }

}
module.exports = new JUtil();
