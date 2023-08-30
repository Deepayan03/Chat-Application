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

module.exports=app;