import express from "express";
import UserAuth from "../middlewares/AuthMiddleWare.js";
import {
  accessChat,
  addToGroup,
  createGroupChat,
  fetchChats,
  remove,
  renameGroup,
} from "../Controllers/chatControllers.js";
const chatRoutes = express();

chatRoutes.route("/").post(UserAuth, accessChat).get(UserAuth, fetchChats);
chatRoutes.route("/group").post(UserAuth, createGroupChat);
chatRoutes.route("/rename-group").put(UserAuth, renameGroup);
chatRoutes.route("/group-remove").put(UserAuth,remove);
chatRoutes.route("/add-to-group").put(UserAuth, addToGroup);

export default chatRoutes;
