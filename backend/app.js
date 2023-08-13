import express from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();

// Enable CORS middleware at the beginning
app.use(cors());

// Use morgan for logging
app.use(morgan("dev"));

// Define your API routes here
app.get("/api/chats", (req, res) => {
    let chatData="Server is working properly"

    res.status(200).json({
        success:true,
        data: chatData
    })
});

// Start the server


export default app;