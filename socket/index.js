const { Server } = require("socket.io");

const io = new Server({ cors: "http://localhost:5173/" });

let onlineUsers = [];
io.on("connection", (socket) => {
  console.log("new socket connected", socket.id);

  socket.on("addNewUser", (userId) => {
    //check if already exist
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({ userId, socketId: socket.id });

    console.log("onlineUsers=>", onlineUsers);
    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find((user_) => user_.userId === message.recepientId);
    console.log("sendMessage=>",message)
    if (user) io.to(user.socketId).emit("getMessage", message);
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    console.log("onlineUsers=>", onlineUsers);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

let PORT = process.env.SOCKET_PORT || 5000;

io.listen(PORT);
