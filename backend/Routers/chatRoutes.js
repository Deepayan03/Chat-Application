const express = require("express");
const UserAuth = require("../middlewares/AuthMiddleWare.js");
const {
  accessChat,
  addToGroup,
  createGroupChat,
  fetchChats,
  remove,
  renameGroup,
  deleteChats,
  changeGroupChatAvatar,
  promoteAsGroupAdmin,
  removeAsGroupAdmin,
} = require("../Controllers/chatControllers.js");
const chatRoutes = express();
// /api/chat/
chatRoutes.route("/").post(UserAuth, accessChat).get(UserAuth, fetchChats).delete(UserAuth,deleteChats);
// /api/chat/group
chatRoutes.route("/group").post(UserAuth, createGroupChat);
// /api/chat/rename-group
chatRoutes.route("/rename-group").put(UserAuth, renameGroup);
// /api/chat/group-remove
chatRoutes.route("/group-remove").put(UserAuth,remove);
// /api/chat/add-to-group
chatRoutes.route("/add-to-group").put(UserAuth, addToGroup);
// /api/chat/change-group-avatar
chatRoutes.route("/change-group-avatar").put(UserAuth,changeGroupChatAvatar);
// /api/chat/promoteAsGroupAdmin
chatRoutes.route("/promoteAsGroupAdmin").put(UserAuth,promoteAsGroupAdmin);
// /api/chat/removeAsGroupAdmin
chatRoutes.route("/removeAsGroupAdmin").put(UserAuth,removeAsGroupAdmin)
module.exports=chatRoutes;
