const app = require("./app.js");

const PORT = process.env.PORT || 5001;

const server=app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:3000",
      // credentials: true,
    },
  });
  
  io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });
  
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User Joined Room: " + room);
    });

    socket.on("new message", (newMessageRecieved) => {
      let chat = newMessageRecieved.chat;
        console.log(chat)
      if (!chat.users) return console.log("chat.users not defined");
  
      chat.users.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) return;
  
        socket.in(user._id).emit("message recieved", newMessageRecieved);
      });
    });
  
// socket.off("setup", () => {
//       console.log("USER DISCONNECTED");
//       socket.leave(userData._id);
//     });
  });