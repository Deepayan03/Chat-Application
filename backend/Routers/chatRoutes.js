import express from "express"
import UserAuth from "../middlewares/AuthMiddleWare.js";
import  {accessChat, fetchChats}  from "../Controllers/chatControllers.js";
const chatRoutes=express();

chatRoutes.route("/").post(UserAuth,accessChat);
chatRoutes.route("/").get(UserAuth,fetchChats);
// chatRoutes.route("/group").post(UserAuth,createGroup);
// chatRoutes.route("/rename-group").put(UserAuth,renameGroup);
// chatRoutes.route("/group-remove").get(UserAuth,remove);
// chatRoutes.route("/add-to-group").put(UserAuth,addToGroup);

export default chatRoutes;