import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv"
import connectDb from "./config/dbConfig.js";
import userRoutes from "./Routers/userRoutes.js"
import errorMiddleWare from "./middlewares/errorMiddleware.js";
import chatRoutes from "./Routers/chatRoutes.js";
import messageRoutes from "./Routers/messageRoutes.js"
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

export default app;