const axios = require('axios');
const CONSTANTS = require('./constant');
class JImip{
    /**
     * @setHeader
     * @param {*} headers 
     * @returns 
     */
    setHeader(headers){
        headers = headers
        ? headers
        : { Authorization: CONSTANTS.APP.apiKey, secretId: CONSTANTS.APP.secretId };
      if (!headers["Authorization"]) headers["Authorization"] = CONSTANTS.APP.apiKey;
      if (!headers["apiKey"]) headers["apiKey"] = CONSTANTS.APP.apiKey;
      if (!headers["secretId"]) headers["secretId"] = CONSTANTS.APP.secretId;
      return headers;
    }
  /**
   * @get
   * @param url
   * @param params
   * @param headers
   */
  async get(url, params, headers) {
    //logger.i("config "+JSON.stringify(config));
    return new Promise((resolve, reject) => {
      headers = this.setHeader(headers);
      let qs = "";
      if (params) qs = "?" + new URLSearchParams(params).toString();
      axios
        .get(url + qs, { headers })
        .then((res) => {
          resolve(res.data);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
          resolve(error);
        });
    });
  }
  /**
   * post
   * @param url
   * @param data
   * @param headers
   */
  async post(url, data, headers) {
    return new Promise((resolve, reject) => {
      headers = this.setHeader(headers);
    //  logger.info("header send ", headers);
    axios
        .post(url, data, { headers })
        .then((res) => {
          resolve(res.data);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
          resolve(error);
        });
    });
  }
  /**
   * post
   * @param url
   * @param data
   * @param headers
   */
  async put(url, data, headers) {
    return new Promise((resolve, reject) => {
      headers = this.setHeader(headers);
      axios
        .put(url, data, { headers })
        .then((res) => {
          resolve(res.data);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
          resolve(error);
        });
    });
  }
  /**
   * @get
   * @param url
   * @param params
   * @param headers
   */
  async delete(url, params, headers) {
    //logger.i("config "+JSON.stringify(config));
    return new Promise((resolve, reject) => {
      headers = this.setHeader(headers);
      let qs = "";
      if (params) qs = "?" + new URLSearchParams(params).toString();
      axios
        .delete(url + qs, { headers })
        .then((res) => {
         // logger.i("request get=>> " + JSON.stringify(res.data));
          resolve(res.data);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
          resolve(error);
        });
    });
  }
}
module.exports = new JImip();