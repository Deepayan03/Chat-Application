const express = require("express");
const UserAuth = require("../middlewares/AuthMiddleWare.js");
const {
  accessChat,
  addToGroup,
  createGroupChat,
  fetchChats,
  remove,
  renameGroup,
} = require("../Controllers/chatControllers.js");
const chatRoutes = express();

chatRoutes.route("/").post(UserAuth, accessChat).get(UserAuth, fetchChats);
chatRoutes.route("/group").post(UserAuth, createGroupChat);
chatRoutes.route("/rename-group").put(UserAuth, renameGroup);
chatRoutes.route("/group-remove").put(UserAuth,remove);
chatRoutes.route("/add-to-group").put(UserAuth, addToGroup);

module.exports=chatRoutes;
