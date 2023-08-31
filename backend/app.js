const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDb = require("./config/dbConfig.js");
const userRoutes = require("./Routers/userRoutes.js");
const chatRoutes = require("./Routers/chatRoutes.js");
const messageRoutes = require("./Routers/messageRoutes.js");
const errorMiddleWare = require("./middlewares/errorMiddleware.js");
const app = express();
app.use(express.json());// TO accept json data
dotenv.config();
connectDb();
app.use(cors());

// Use morgan for logging
app.use(morgan("dev"));
// Define your API routes here
app.use("/api/user",userRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/message",messageRoutes);
app.get("/api/chats", (req, res) => {
    let chatData="Server is working properly"
    res.status(200).json({
        success:true,
        data: chatData
    })
});

app.use(errorMiddleWare);
// If someone hits on the same port but wrong url then this error will be thrown 
app.all("*",(req,res)=>{
    res.status(404).json({
        message:"OOPS Please check your url"
    });
});
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
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  
    socket.on("new message", (newMessageRecieved) => {
      var chat = newMessageRecieved.chat;
  
      if (!chat.users) return console.log("chat.users not defined");
  
      chat.users.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) return;
  
        socket.in(user._id).emit("message recieved", newMessageRecieved);
      });
    });
  
    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
  });

module.exports=app;