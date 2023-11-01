const socket = require("socket.io");
const { CLIENT_PORT } = process.env;


module.exports = (server) => {
  const io = socket(server, {
    cors: {
      origin: `http://localhost:${CLIENT_PORT}`,
      credentials: true,
    },
  });

  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;

    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.msg);
      }
    });
  });
}
