const io = require("socket.io");
class JSocketio {

  initIalize(server) {
    if (process.env.SOCKET_ENABLE == 'true') {
      global.logger.trace("Socket starting.");
      const configIo = {
        serveClient: process.env.SOCKET_CLIENT,
        // wsEngine: "ws",
        // allowEIO3: true,
        transports: [process.env.SOCKET_TRASNPORTS],
      };
      if (process.env.SOCKET_PATH) {
        configIo["path"] = "/" + process.env.SOCKET_PATH + "/";
      }
      if (process.env.SOCKET_PINGINTERVAL) {
        configIo["pingInterval"] = process.env.SOCKET_PINGINTERVAL;
      }
      if (process.env.SOCKET_PINGTIMEOUT) {
        configIo["pingTimeout"] = process.env.SOCKET_PINGTIMEOUT;
      }
      if (process.env.SOCKET_CORS == "true") {
        configIo["cors"] = {
          "origin": "*",
          "allowedHeaders": [
            "socket.io"
          ],
          "credentials": true
        };
      }
      //logger.info("configIo is",configIo);
      const socketio = io(server, configIo);
      return this.connection(socketio);
    }
  }
  /**
   * @setAuthenToken
   * @param client
   * @param next
   */
  async setAuthenToken(client, next) {
    const token = client.request._query.token;
    let device = client.request._query.device;
    if (!device) device = "undefined";
    const data = token ? await Auth.verifyAccessToken(token) : null;
    if (data) {
      client.user = data.user;
    }
    return next();
  }
  /**
   * 
   */
  connection(socketio) {
    this.socketio = socketio;
    let time_end;
    socketio.use(this.setAuthenToken);
    socketio.on("connection", function (socket) {
      global.logger.trace("Socket connected successful!.");
      const _this= new JSocketio();
      if (socket.user && socket.user.id) {
        //set rooms socket
        const pathUser = _this.userPath(socket.user.id);
        socket.join(pathUser);
        // logger.debug("pathUser", pathUser);
        var files = fs.readdirSync(global.pathSocket);
        _.each(files, (file) => {
          if (!_s.endsWith(file, ".js")) return;
          var route = require(path.join(global.pathSocket, file));
          app.socket = socket;
          route.init(socket, socket.user);
        });
      }
      socket.emit("totalConnect",_this.getConnected(socket));
      socket.broadcast.emit("totalConnect",_this.getConnected(socket));
      //
      socket.on("disconnect", () => {
        global.logger.error("Socket disconnect successful!.");
        time_end = new Date().getTime();
        if (socket.user) {
          const online = _this.isOnline(_this.userPath(socket.user.id));
        }
        socket.broadcast.emit("totalConnect",_this.getConnected(socket));
      });
    });
    return socketio;
  }
  getConnected(socket){
    const rooms=socket.client.conn.server.clientsCount;
    global.logger.trace("connect info is",rooms);
    const obj= {connected:rooms};
      global.logger.trace("connect info is",rooms);
      return obj;
  }
  disconnect() {
    this.socketio.on("disconnect", (socket) => {
      time_end = new Date().getTime();
      //logger.trace('Socket.disconnect 2', time_end - time_start);
    });
  }
  userPath(id) {
    return "1/" + id;
  }
  isOnline(path) {
    let room;
    for (let item of app.io.sockets.adapter.rooms) {
      if (item[0] == path) {
        room = item[1] ? item[1] : null;
      }
    }
    return room ? true : false;
  }
  /**
   * 
   */
  async setOnline(user) {
    const obj = {
      status: true,
      userId: user.id
    };
    const keyCache = CacheService.createKey(user.id);
    const u = await CacheService.get(keyCache);
    if (!u || !u.status) {
      CacheService.set(keyCache, obj);
    }
  }
  /**
   * 
   */
  async setOffline(user) {
    const obj = {
      status: false,
      userId: user.id
    };
    const keyCache = CacheService.createKey(user.id);
    const u = await CacheService.get(keyCache);
    if (u && u.status) {
      CacheService.set(keyCache, obj);
    }
  }
}
module.exports = new JSocketio();
