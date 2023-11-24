class JSocketio{
    
    initIalize(server){
        if (process.env.SOCKET_ENABLE) {
            global.logger.trace("Socket starting.");
            const io = require("socket.io");
            const configIo = {
                serveClient: process.env.SOCKET_CLIENT,
                // wsEngine: "ws",
                // allowEIO3: true,
                path: "/" + process.env.SOCKET_PATH + "/",
                transports: [process.env.SOCKET_TRASNPORTS],
              };
              if (process.env.SOCKET_PINGINTERVAL) {
                configIo["pingInterval"] = process.env.SOCKET_PINGINTERVAL;
              }
              if (process.env.SOCKET_PINGTIMEOUT) {
                configIo["pingTimeout"] =process.env.SOCKET_PINGTIMEOUT;
              }              
              const socketio= io(server, configIo);
              return this.connection(socketio);
          }
    }
    /**
     * 
     */
    connection(socketio){
        this.socketio=socketio;
        socketio.on("connection", (socket) => {
                global.logger.trace("Socket connected successful!.");
                if (socket.user && socket.user.id) {
                  //set rooms socket
                  const pathUser = vnap.userPath(socket.user.id);
                  socket.join(pathUser);
                  // logger.debug("pathUser", pathUser);
                  var files= fs.readdirSync(global.pathSocket);
                  _.each(files, (file) => {
                    if (!_s.endsWith(file, ".js")) return;
                    var route = require(path.join(global.pathSocket, file));
                    app.socket = socket;
                    route.init(socket, socket.user);
                  });
                }
                socket.on("disconnect", () => {
                  global.logger.error("Socket disconnect successful!.");
                  time_end = new Date().getTime();
                  if (socket.user) {
                    var online = vnap.isOnline(vnap.userPath(socket.user.id));
                  }
                  //   logger.trace('Socket.disconnect 1', 'online', online, time_end - time_start);
                  // if (interval) clearInterval(interval);
                });
        });
        return socketio;
    }
    disconnect(){
        this.socketio.on("disconnect", (socket) => {
            time_end = new Date().getTime();
            //logger.trace('Socket.disconnect 2', time_end - time_start);
          });
    }
}
module.exports = new JSocketio();