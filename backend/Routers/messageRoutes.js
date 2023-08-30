const { Router } = require("express");
const { allMessages, sendMessage } = require("../Controllers/messageControllers.js");
const UserAuth = require("../middlewares/AuthMiddleWare.js");

const router=Router();
router.route("/").post(UserAuth,sendMessage);
router.route("/:chatId").get(UserAuth,allMessages);


module.exports=router;